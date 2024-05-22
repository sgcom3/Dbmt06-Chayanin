import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { I18nService } from '../services/i18n.service';

@Injectable({
    providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
    constructor(@Inject('BASE_URL') private baseUrl: string, private i18n: I18nService, private injector: Injector) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const reg = new RegExp(this.baseUrl);

        if (reg.test(request.url)) {
            let headers = Object.assign({}, {
                language: this.i18n.language || this.i18n.defaultLanguage,
            })

            return next.handle(request.clone({ setHeaders: headers }));
        }

        return next.handle(request);
    }
}   