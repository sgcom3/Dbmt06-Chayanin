import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared/shared.module";
import { SuRoutingModule } from "./su-routing.module";
import { LazyTranslationService } from "@app/core/services/lazy-translation.service";
import { MessageListComponent } from './sumt20/message-list/message-list.component';
import { MessageDetailComponent } from './sumt20/message-detail/message-detail.component';
import { Sumt20Service } from "./sumt20/sumt20.service";

@NgModule({
    declarations: [
       
    
    MessageListComponent,
                  MessageDetailComponent
  ],
    imports: [
        CommonModule,
        SuRoutingModule,
        SharedModule,
    ],
    providers: [
        Sumt20Service
    ]
})
export class SuModule {
    constructor(private lazy: LazyTranslationService) {
        lazy.add('su');
    }
}
