import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/table-server/page';
import { PaginatedDataSource } from '@app/shared/components/table-server/server-datasource';
import { Dbmt04Service } from '../dbmt04.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'app-list-value',
  templateUrl: './list-value.component.html',
  styleUrl: './list-value.component.scss'
})
export class ListValueComponent implements OnInit {
  keyword = '';
  initialPageSort = new PageCriteria('groupCode,value,valueText,sequence,description,active');
  data: PaginatedDataSource<any, any>
  groupCode: string;
  canInsert: boolean;
  canDelete: boolean;
  canEdit: boolean;
  navigation: any;
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    sessionStorage.setItem('dbmt04state', JSON.stringify(this.navigation))
  }
  constructor(
    private router: Router,
    private db: Dbmt04Service,
    private save: SaveDataService,
    private ms: NotifyService,
  ) {
    this.navigation = this.router.getCurrentNavigation()?.extras?.state;
    if (this.navigation) {
      this.groupCode = this.navigation.groupCode;
      this.canInsert = this.navigation.canInsert;
      this.canDelete = this.navigation.canDelete;
      this.canEdit = this.navigation.canEdit;
    }
    else {
      this.navigation = JSON.parse(sessionStorage.getItem('dbmt04state'));
      this.groupCode = this.navigation.groupCode;
      this.canInsert = this.navigation.canInsert;
      this.canDelete = this.navigation.canDelete;
      this.canEdit = this.navigation.canEdit;
      sessionStorage.removeItem('dbmt04state')
    }
  }

  ngOnInit(): void {
    this.initialPageSort = this.save.retrive('dbmt04page' + this.groupCode) ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt04' + this.groupCode) ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.searchListValue(request, query),
      this.initialPageSort);
    this.data.queryBy({ keyword: this.keyword, groupCode: this.groupCode });
  }

  onSearch() {
    this.data.queryBy({ keyword: this.keyword, groupCode: this.groupCode }, true);
  }

  form() {
    this.router.navigate(['/db/dbmt04/value/detail'],
      { state: { groupCode: this.groupCode, valueId: null, canEdit: this.canEdit } }
    );
  }

  remove(code) {
    if (code) {
      this.db.deleteListValue(code).subscribe((res: any) => {
        this.ms.success('message.STD00014');
        const page = this.data.queryBy({ keyword: this.keyword, groupCode: this.groupCode }, true);
      });
    }
  }

  cancel() { }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt04' + this.groupCode);
    this.save.save(this.data.getPageInfo(), 'dbmt04page' + this.groupCode);
  }

}
