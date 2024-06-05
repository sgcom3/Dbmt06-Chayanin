import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/table-server/page';
import { PaginatedDataSource } from '@app/shared/components/table-server/server-datasource';
import { Dbmt04Service } from '../dbmt04.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrl: './list-group.component.scss',
})
export class ListGroupComponent implements OnInit {
  initialPageSort = new PageCriteria(
    'groupCode,sequence,parentGroupCode,description,active,canInsert,canDelete,canEdit'
  );
  keyword: string = '';
  data: PaginatedDataSource<any, any>;

  constructor(
    private router: Router,
    private db: Dbmt04Service,
    private save: SaveDataService,
    private ms: NotifyService
  ) {}

  ngOnInit(): void {
    this.initialPageSort =
      this.save.retrive('dbmt04page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt04') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getSearchListGroup(request, query),
      this.initialPageSort
    );
    this.data.queryBy({ keyword: this.keyword });
  }

  onSearch() {
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  form() {
    this.router.navigate(['/db/dbmt04/detail']);
  }

  remove(code) {
    if (code) {
      this.db.deleteListGroup(code).subscribe((res: any) => {
        this.ms.success('message.STD00014');
        const page = this.data.queryBy({ keyword: this.keyword }, true);
      });
    }
  }

  cancel() {}

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt04');
    this.save.save(this.data.getPageInfo(), 'dbmt04page');
  }
}
