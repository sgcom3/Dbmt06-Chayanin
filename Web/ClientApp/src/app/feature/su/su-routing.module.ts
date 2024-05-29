import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivate } from "@app/core/guard/core.guard";
import { MessageListComponent } from "./sumt20/message-list/message-list.component";
import { MessageDetailComponent } from "./sumt20/message-detail/message-detail.component";
import { messageDetailResolver } from "./sumt20/message-detail/message-detail.resolver";

const routes: Routes = [
    {
        path: '',
        children:[
            {
                path: 'sumt20',
                component:
                MessageListComponent,
                data: { code: 'sumt20' },
            },
            {
                path: 'sumt20/detail',
                component:
                MessageDetailComponent,
                canDeactivate: [CanDeactivate],
                data: { code: 'sumt20' },
                resolve : { sumt20: messageDetailResolver }
            },]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class SuRoutingModule { }