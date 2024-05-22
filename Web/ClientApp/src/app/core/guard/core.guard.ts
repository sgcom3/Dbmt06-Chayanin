import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';


export const CanDeactivate: CanDeactivateFn<any> = (component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  if (component.canDeactivate) {
    const result = component.canDeactivate();

    if (typeof result == "boolean") return result;

    return (result as Observable<boolean>)
  }

  return true;
}