import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { Observable, forkJoin, map, of } from "rxjs";
import { Dbmt04Service } from "../dbmt04.service";

export const ListGroupDetailResolverService: ResolveFn<Observable<any>> = () => {
    const router = inject(Router);
    const db = inject(Dbmt04Service);
    
    let groupCode = null;
    let systemControl = null;
    let parentGroupCode = db.getParentGroupCode();
    if (router.getCurrentNavigation().extras.state) {
        groupCode = router.getCurrentNavigation().extras.state['groupCode'];
        systemControl = router.getCurrentNavigation()?.extras.state['systemControl'];
    }
    let resolverUpdateData = of({});
    if (groupCode) {
        resolverUpdateData = db.getListGroupByGroupCode(groupCode);
    }
  
     return forkJoin([resolverUpdateData, parentGroupCode]).pipe(
        map((result) => {
            let detail = result[0];
            let parentGroupCodes = result[1];
            return { detail, systemControl , parentGroupCodes};
        })
    );
}