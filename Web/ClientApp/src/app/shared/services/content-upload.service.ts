import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterService } from '@app/shared/services/parameter.service';
import { AttachmentType, Category } from '@app/shared/types/data.types';
import { Observable, catchError, map, of, switchMap } from 'rxjs';


export interface ContentPath {
  DisplayUrl: string,
  ApiUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class ContentUploadService {

  constructor(private http: HttpClient, private ps: ParameterService) { }

  getContentUrl(): Observable<ContentPath> {
    return this.ps.getParameter('ContentPath');
  }

  getContent(id: number) {
    return this.getContentUrl().pipe(
      switchMap((contentPath: ContentPath) => this.http.disableApiPrefix().skipErrorHandler().disableLoading().get<any>(`${contentPath.ApiUrl}/api/content`, { params: { id } }).pipe(
        map((content) => {
          content["path"] = `${contentPath.DisplayUrl}/${content["container"]}/${content["path"]}`
          return content;
        })
      )),
      catchError(() => {
        return of({ id: null, name: null, path: null })
      })
    )
  }

  upload(file: File, type: AttachmentType, category: Category): Observable<any | HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("category", category || Category.Defalt);

    return this.getContentUrl().pipe(
      switchMap((contentPath: ContentPath) => this.http.disableApiPrefix().skipErrorHandler().disableLoading().post<any>(`${contentPath.ApiUrl}/api/content`, formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(
        map(event => {
          if (event.type == HttpEventType.Response) {
            const content = event.body;
            content.path = `${contentPath.DisplayUrl}/${content.container}/${content.path}`
            return content;
          }
          return event;
        })
      ))
    )
  }
}
