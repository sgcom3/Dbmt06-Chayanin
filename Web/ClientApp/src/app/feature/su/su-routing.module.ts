import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CanDeactivate } from "@app/core/guard/core.guard";

const routes: Routes = [
    {
        path: '',
        children: []
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class SuRoutingModule { }