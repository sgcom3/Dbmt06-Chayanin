import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBase } from '@app/shared/services/base.service';
import { Timestamp } from 'rxjs';

export class LangList extends EntityBase {
  languageCode: string = null;
  description: string = null;
  active: boolean = true;
}


@Injectable({
  providedIn: 'root'
})
export class Dbmt20Service {

  constructor(private http: HttpClient) { }
  
  getListLanguage(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt20/languageList', { params: filter });
  }

  getLanguage(code: string) {
    return this.http.get<LangList>('dbmt20/languageDetail' , { params: { LanguageCode: code } });
  }

  saveLanguage(dbListGroup: LangList) {
    return this.http.post('dbmt20/saveLanguage', dbListGroup);
  }

  getLanguageCode() {
    return this.http.get<any>('dbmt20/languageCode');
  } 

  deleteLanguage(code: string) {
    return this.http.delete('dbmt20/deleteLanguage', { params: { LanguageCode: code } })
}
}
