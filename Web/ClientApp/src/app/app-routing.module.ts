import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutRoute } from './layout/service/shell.service';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { EmptyComponent } from './pages/empty/empty.component';
import { AccessdeniedComponent } from './pages/accessdenied/accessdenied.component';

const routes: Routes = [
  { path: 'empty/lang/:code', component: EmptyComponent },
  { path: 'notfound', component: NotfoundComponent, title: "Page Not Found" },
  { path: 'access-denied', component: AccessdeniedComponent, title: "Access Denied" },
  LayoutRoute.childRoutes([
    { path: 'demo', loadChildren: () => import("./feature/demo/demo.module").then(m => m.DemoModule) },
    { path: 'db', loadChildren: () => import("./feature/db/db.module").then(m => m.DbModule) },
    { path: 'su', loadChildren: () => import("./feature/su/su.module").then(m => m.SuModule) },
  ]),
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    canceledNavigationResolution: 'computed'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
