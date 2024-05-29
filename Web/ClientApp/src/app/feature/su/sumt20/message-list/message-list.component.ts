import { Component, OnInit } from '@angular/core';
import { PageCriteria } from '@app/shared/components/table-server/page';
import { PaginatedDataSource } from '@app/shared/components/table-server/server-datasource';
import {Sumt20Service } from '../sumt20.service';
import { Router } from '@angular/router';
import { SaveDataService } from '@app/core/services/save-data.service';
import { NotifyService } from '@app/core/services/notify.service';
import { messageDetailResolver } from '../message-detail/message-detail.resolver';

@Component({
  selector: 'x-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.scss'
})
export class MessageListComponent implements OnInit {
  initialPageSort = new PageCriteria('messageCode,languageCode,messageDesc,remark');
  keyword: string = '';
  data: PaginatedDataSource<any, any>;
  language;
  selectedLang:string = '';

  constructor(
    private router: Router,
    private db: Sumt20Service,
    private save: SaveDataService,
    private ms: NotifyService
  ) {}

  ngOnInit(): void {
    this.initialPageSort = this.save.retrive('sumt20page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('sumt20') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getMessage(request, query),
      this.initialPageSort
    );
    this.data.queryBy({ keyword: this.keyword,lang: this.selectedLang});
    this.fetchLanguages();
  }

  onSearch() {
    this.data.queryBy({ keyword: this.keyword,lang: this.selectedLang}, true);
  }

  clearSearch() {
    if(this.keyword === '' && this.selectedLang === '') return;
    this.keyword = '';
    this.selectedLang = ''
    this.data.queryBy({ keyword: this.keyword,lang: this.selectedLang }, true);
  }
  fetchLanguages(): void {
    this.db.getLanguage().subscribe(
      (response) => {
        if (response && Array.isArray(response.rows)) {
          this.language = response.rows.map(lang => ({ name: lang.languageCode, code: lang.languageCode }));
        } else {
          console.error('Expected an array, but received:', response);
        }
      },
      (error) => {
        console.error('Error fetching languages', error);
      }
    );
  }

  form() {
    this.router.navigate(['/su/sumt20/detail']);
  }

  remove(code) {
    if (code) {
      this.db.deleteMessage(code).subscribe((res: any) => {
        this.ms.success('message.STD00014');
        const page = this.data.queryBy({ keyword: this.keyword }, true);
      });
    }
  }

  cancel() {
  }
  ngOnDestroy(){
    this.save.save(this.keyword, 'sumt20');
    this.save.save(this.data.getPageInfo(), 'sumt20page');
  }
}
