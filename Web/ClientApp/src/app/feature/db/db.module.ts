import { NgModule } from "@angular/core";
import { ListGroupComponent } from "./dbmt04/list-group/list-group.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DbRoutingModule } from "./db-routing.module";
import { ListGroupDetailComponent } from './dbmt04/list-group-detail/list-group-detail.component';
import { ListValueComponent } from "./dbmt04/list-value/list-value.component";
import { ListValueDetailComponent } from './dbmt04/list-value-detail/list-value-detail.component';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { LazyTranslationService } from "@app/core/services/lazy-translation.service";

@NgModule({
    declarations: [
        ListGroupComponent,
        ListGroupDetailComponent,
        ListValueComponent,
        ListValueDetailComponent,
    ],
    imports: [
        CommonModule,
        DbRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [

    ]
})
export class DbModule {
    constructor(private lazy: LazyTranslationService) {
        lazy.add('db');
    }
}
