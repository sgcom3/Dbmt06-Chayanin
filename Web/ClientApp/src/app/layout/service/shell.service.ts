import { Routes, Route } from '@angular/router';
import { LayoutComponent } from '../layout.component';

export class LayoutRoute {

  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: LayoutComponent,
      children: routes,
      data: { reuse: true }
    };
  }
}