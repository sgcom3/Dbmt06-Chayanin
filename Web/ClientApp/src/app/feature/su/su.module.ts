import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuRoutingModule } from "./su-routing.module";
import { LazyTranslationService } from "@app/core/services/lazy-translation.service";

@NgModule({
    declarations: [
       
    ],
    imports: [
        CommonModule,
        SuRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [

    ]
})
export class SuModule {
    constructor(private lazy: LazyTranslationService) {
        lazy.add('su');
    }
}
