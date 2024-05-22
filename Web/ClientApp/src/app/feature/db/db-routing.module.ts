import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivate } from "@app/core/guard/core.guard";
import { ListGroupComponent } from "./dbmt04/list-group/list-group.component";
import { ListGroupDetailComponent } from "./dbmt04/list-group-detail/list-group-detail.component";
import { ListGroupDetailResolverService } from "./dbmt04/list-group-detail/list-group-detail.resolver";
import { ListValueComponent } from "./dbmt04/list-value/list-value.component";
import { ListValueDetailComponent } from "./dbmt04/list-value-detail/list-value-detail.component";
import { ListValueDetailResolverService } from "./dbmt04/list-value-detail/list-value-detail.resolver";

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
        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class DbRoutingModule { }