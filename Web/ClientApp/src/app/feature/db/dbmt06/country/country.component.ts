import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/table-server/page';
import { PaginatedDataSource } from '@app/shared/components/table-server/server-datasource';
import { Dbmt06Service } from '../dbmt06.service';

@Component({
  selector: 'x-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
})
export class CountryComponent implements OnInit {
  initialPageSort = new PageCriteria(
    'countryCode,countryName,description,active'
  );
  keyword: string = '';
  data: PaginatedDataSource<any, any>;

  constructor(
    private router: Router,
    private db: Dbmt06Service,
    private save: SaveDataService,
    private ms: NotifyService
  ) {}

  ngOnInit(): void {
    this.initialPageSort =
      this.save.retrive('dbmt06page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt06') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getCountries(request, query),
      this.initialPageSort
    );
    this.data.queryBy({ keyword: this.keyword });
  }

  onSearch() {
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  form() {
    this.router.navigate(['/db/dbmt06/detail']);
  }

  remove(code) {
    if (code) {
      this.db.deleteCountry(code).subscribe((res: any) => {
        this.ms.success('message.STD00014');
        const page = this.data.queryBy({ keyword: this.keyword }, true);
      });
    }
  }

  cancel() {}

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt06');
    this.save.save(this.data.getPageInfo(), 'dbmt06page');
  }
}
