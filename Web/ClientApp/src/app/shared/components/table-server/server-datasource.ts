import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, combineLatest, defer, filter, finalize, map, Observable, share, Subject, switchMap } from "rxjs";
import { Page, PageRequest, PaginatedEndpoint, Sort } from "./page";
import { PageEvent, PaginatorState, SortEvent } from "./table-server.interface";

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback();
        return source;
    });
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => source.pipe(
        prepare(() => indicator.next(true)),
        finalize(() => indicator.next(false))
    )
}

export interface SimpleDataSource<T> extends DataSource<T> {
    connect(): Observable<T[]>;
    disconnect(): void;
}


export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {

    private reload!: BehaviorSubject<boolean>;
    private defaultSort: Sort<any>[];
    private pageSort: BehaviorSubject<PageRequest<T>>
    private loading = new Subject<boolean>();

    public loading$ = this.loading.asObservable();
    public page$: Observable<Page<T>>;
    private query: Q = {} as Q;
    private currentData?: Page<T>
    constructor(
        private endpoint: PaginatedEndpoint<T, Q>,
        defaultPageSort: PageRequest<T>) {

        this.reload = new BehaviorSubject<boolean>(false);
        this.defaultSort = defaultPageSort.sorts;
        this.pageSort = new BehaviorSubject<PageRequest<T>>(defaultPageSort)
        const param$ = combineLatest([this.pageSort, this.reload.pipe(filter(load => load))]);

        this.page$ = param$.pipe(
            switchMap(([pageSort, reload]) => {
                const pageSortDto: PageRequest<T> = Object.assign({}, pageSort);
                delete pageSortDto.sorts;     
                return this.endpoint(pageSortDto, this.query)
                    .pipe(
                        indicate(this.loading),
                        map(result => {
                            this.currentData = { rows: result.rows, size: pageSort.size, number: pageSort.page, count: result.count } as Page<T>
                            return this.currentData;
                        })
                    )
            }),
            share()
        )
    }

    sortBy(sortEvent: SortEvent): void {
        const lastPageSort = this.pageSort.getValue();
        const sorts: Sort<any>[] = !sortEvent.order ? this.defaultSort : [{ property: sortEvent.field, direction: (sortEvent.order == 1 ? 'asc': 'desc') }];
        const nextPageSort: PageRequest<any> = { ...lastPageSort, sorts: sorts,sort:sorts.map(s=>`${s.property} ${s.direction}`).join(',')}
        this.pageSort.next(nextPageSort);
    }

    queryBy(query: Q, reset: boolean = false): void {
        this.query = query;
        if (reset) {
            this.fetch({ page: 0, rows: this.getPageInfo()?.size } as PageEvent)
        }
        else this.reload.next(true);
    }

    fetch(page: PageEvent | PaginatorState): void {
        const lastPageSort = this.pageSort.getValue();
        const nextPageSort = { ...lastPageSort, ...{ page: page.page, size: page.rows } }
        this.pageSort.next(nextPageSort);
    }

    get data() {
        return this.currentData ? this.currentData.rows : []
    }

    getPageInfo() {
        console.log('get page info',this.pageSort.getValue());
        
        return this.pageSort.getValue();
    }

    get sortInfo(): Sort<any> {
        const pageInfo = this.getPageInfo();
        if (pageInfo && pageInfo.sorts && pageInfo.sorts.length === 1) {
            return { property: pageInfo.sorts[0].property, direction: pageInfo.sorts[0].direction };
        }
        return { property: '', direction: 'asc' };
    }

    calculatePageAfterDelete() {
        const pageInfo = this.pageSort.getValue();
        const index = Math.min(Math.ceil((this.currentData.count - 1) / pageInfo.size) - 1, pageInfo.page);
        const page : PageEvent = <PageEvent>{};
        page.page = index < 0 ? 0 : index;
        page.pageCount = pageInfo.size;
        return page;
    }

    connect(): Observable<T[]> {
        return this.page$.pipe(map(page => page.rows));
    }

    disconnect(): void {

    }

}