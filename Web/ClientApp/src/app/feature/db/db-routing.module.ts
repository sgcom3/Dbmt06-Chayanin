import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivate } from "@app/core/guard/core.guard";
import { ListGroupComponent } from "./dbmt04/list-group/list-group.component";
import { ListGroupDetailComponent } from "./dbmt04/list-group-detail/list-group-detail.component";
import { ListGroupDetailResolverService } from "./dbmt04/list-group-detail/list-group-detail.resolver";
import { ListValueComponent } from "./dbmt04/list-value/list-value.component";
import { ListValueDetailComponent } from "./dbmt04/list-value-detail/list-value-detail.component";
import { ListValueDetailResolverService } from "./dbmt04/list-value-detail/list-value-detail.resolver";
import { LangListComponent } from "./dbmt20/lang-list/lang-list.component";
import { LangDetailComponent } from "./dbmt20/lang-detail/lang-detail.component";
import { langDetailResolver } from "./dbmt20/lang-detail/lang-detail.resolver";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dbmt04',
                component: ListGroupComponent,
                data: { code: 'dbmt04' },
            },
            {
                path: 'dbmt04/detail',
                component: ListGroupDetailComponent,
                canDeactivate: [CanDeactivate],
                resolve: { dbmt04: ListGroupDetailResolverService },
                data: { code: 'dbmt04' },
            },
            {
                path: 'dbmt04/value',
                component: ListValueComponent,
                data: { code: 'dbmt04' },
            },
            {
                path: 'dbmt04/value/detail',
                component: ListValueDetailComponent,
                canDeactivate: [CanDeactivate],
                resolve: { dbmt04: ListValueDetailResolverService },
                data: { code: 'dbmt04' },
            },
            {
                path: 'dbmt20',
                component: LangListComponent,
                data: { code: 'dbmt20' },
            },
            {
                path: 'dbmt20/detail',
                component: LangDetailComponent,
                canDeactivate: [CanDeactivate],
                resolve: { dbmt20: langDetailResolver },
                data: { code: 'dbmt20' },
            },
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class DbRoutingModule { }