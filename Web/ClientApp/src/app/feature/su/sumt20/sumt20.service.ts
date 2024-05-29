import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { EntityBase } from "@app/shared/services/base.service";
import { Observable, ObservedValueOf } from 'rxjs';

export class Message extends EntityBase {
  messageCode: string = null;
  languageCode: string = null;
  messageDesc: string = null;
  remark: string = null;
}

interface LanguageResponse {
  rows: { languageCode: string }[];
  count: number; 
}

@Injectable({
  providedIn: 'root'
})
export class Sumt20Service {

  constructor(private http: HttpClient) { }

    getMessage(page: any, query: string) {
      const filter = Object.assign(query, page);
      return this.http.get<any>('sumt20/SearchMessage', { params: filter });
    }

    getLanguage(): Observable<LanguageResponse> {
      return this.http.get<LanguageResponse>('sumt20/GetLanguage');
    }

    deleteMessage(code: string){
      return this.http.delete(`sumt20/DeleteMessage`, { params: { messageCode: code } });
    }
    getMessageByCode(code : string): Observable<Message>{
      return this.http.get<Message>(`sumt20/GetMessageByCode`, { params: { messageCode: code } });
    }
    saveMessage(data: Message){
      return this.http.post('sumt20/SaveMessage', data);
    }
}
