import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/table-server/page';
import { PaginatedDataSource } from '@app/shared/components/table-server/server-datasource';
import { Dbmt20Service } from '../dbmt20.service';
import { query } from '@angular/animations';

@Component({
  selector: 'x-lang-list',
  templateUrl: './lang-list.component.html',
  styleUrl: './lang-list.component.scss'
})
export class LangListComponent implements OnInit {
  initialPageSort = new PageCriteria(
    'languageCode,description,active'
  );
  keyword: string = '';
  data: PaginatedDataSource<any, any>;
  
  constructor(
    private router: Router,
    private db : Dbmt20Service,
    private save: SaveDataService,
    private ms: NotifyService,
  ) { }

  ngOnInit(): void {
    this.initialPageSort = this.save.retrive('dbmt20page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt20') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getListLanguage(request, query),
      this.initialPageSort
    );
    this.data.queryBy({ keyword: this.keyword });
  }
  onSearch() {
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  form() {
    this.router.navigate(['/db/dbmt20/detail']);
  }
  remove(code) {
    if (code) {
      this.db.deleteLanguage(code).subscribe((res: any) => {
        this.ms.success('message.STD00014');
        const page = this.data.queryBy({ keyword: this.keyword }, true);
      });
    }
  }

  cancel() {
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt20');
    this.save.save(this.data.getPageInfo(), 'dbmt20page');
  }
}
