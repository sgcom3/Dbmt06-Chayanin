import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { Observable, forkJoin, map, of } from "rxjs";
import { ListValue, Dbmt04Service } from "../dbmt04.service";

export const ListValueDetailResolverService: ResolveFn<Observable<any>> = () => {
    const router = inject(Router);
    const db = inject(Dbmt04Service);

    const code = <any>router.getCurrentNavigation()?.extras.state;
    let groupCode = code.groupCode;
    let canEdit = code.canEdit;

    const detail = code?.valueId ? db.getListValueByValueId(code.valueId) : of({ listValueLangs: [] } as Partial<ListValue>);
    const master = db.getMaster();
    return forkJoin([detail, master]).pipe(map((result) => {
        let detail = result[0];
        let master = result[1];
        return { master, detail, groupCode, canEdit }
    }))
}