import { Component, Injectable, Input, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MessageService as ToastMessageService } from 'primeng/api';

export interface Message {
    severity?: string;
    summary?: string;
    detail?: string;
    id?: any;
    key?: string;
    life?: number;
    sticky?: boolean;
    closable?: boolean;
    data?: any;
    icon?: string;
    contentStyleClass?: string;
    styleClass?: string;
    closeIcon?: string;
}


//# Note for PrimeNg Toast #
//For toast with HTML Template, Please use the `ToastNgHtmlComponent`
//For normal toast (text), Just use service
@Injectable({
    providedIn: 'root'
})
export class MessageService {
    constructor(
        // private toastr: ToastrService
        private toastr: ToastMessageService
        , private translate: TranslateService) {
    }

    private arrayToObject = (array: string[] = []) =>
        array.reduce((obj: any, item, index) => Object.assign(obj, { [index]: item }), {});

    translatedParams(params: string[] = []): Observable<any> {
        return forkJoin(params.map(item => this.translate.get(item))).pipe(
            map((params) => this.arrayToObject(params))
        )
    }

    translatedMessage(message: string, params: string[] | null = null): Observable<any> {
        return params != null && params.length > 0 ? this.translatedParams(params).pipe(
            switchMap(translated => this.translate.get(message, translated))
        ) : this.translate.get(message);
    }

    info(message: string
        , params: string[] | null = null
        , summary: string | null = "Info")
        : void {
        {
            this.translatedMessage(message, params).subscribe((translated) => {
                this.toastr.add(
                    <Message>{
                        key: 'tsr'
                        , severity: 'info'
                        , summary: summary
                        , detail: translated
                        , life: 3000
                        , closable: true
                        , icon: 'pi-info-circle'
                    })
            });
        }
        // this.translatedMessage(message, params).subscribe((translated) => this.toastr.info(translated, "Information"));
    }

    success(
        message: string
        , params: string[] | null = null
        , summary: string | null = "Success")
        : void {
        {
            this.translatedMessage(message, params).subscribe((translated) => {
                this.toastr.add(
                    <Message>{
                        key: 'tsr'
                        , severity: 'success'
                        , summary: summary
                        , detail: translated
                        , life: 3000
                        , closable: true
                        , icon: 'pi-check'
                    })
            });
        }
        // this.translatedMessage(message, params).subscribe((translated) => this.toastr.success(translated, "Success"));
    }

    error(
        message: string
        , params: string[] | null = null
        , summary: string | null = "Error")
        : void {
        {
            this.translatedMessage(message, params).subscribe((translated) => {
                this.toastr.add(
                    <Message>{
                        key: 'tsr'
                        , severity: 'error'
                        , summary: summary
                        , detail: translated
                        , life: 3000
                        , closable: true
                        , icon: 'pi-times-circle'
                    })
            });
        }
        // this.translatedMessage(message, params).subscribe((translated) => this.toastr.error(translated, "Error", { timeOut: 3000, extendedTimeOut: 5000 }));
    }

    errorConcat(
        message: string
        , summary: string | null = "Error")
        : void {
        {
            this.toastr.add(
                <Message>{
                    key: 'tsr'
                    , severity: 'error'
                    , summary: summary
                    , detail: message
                    , life: 3000
                    , closable: true
                    , icon: 'pi-times-circle'
                });
        }


        // this.toastr.error(message, "Error", { enableHtml: true, timeOut: 3000, extendedTimeOut: 5000 });
    }

    warning(
        message: string
        , params: string[] | null = null
        , summary: string | null = "Warning")
        : void {
        {
            this.translatedMessage(message, params).subscribe((translated) => {
                this.toastr.add(
                    <Message>{
                        key: 'tsr'
                        , severity: 'warn'
                        , summary: summary
                        , detail: translated
                        , life: 3000
                        , closable: true
                        , icon: 'pi-exclamation-triangle'
                    })
            });
        }
        // this.translatedMessage(message, params).subscribe((translated) => this.toastr.warning(translated, "Warning", { timeOut: 3000, extendedTimeOut: 5000 }));
    }
}