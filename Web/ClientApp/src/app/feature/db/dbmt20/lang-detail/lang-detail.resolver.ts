import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt20Service } from '../dbmt20.service';


export const langDetailResolver: ResolveFn<Observable<any>> = () => {
  const router = inject(Router);
  const db = inject(Dbmt20Service);

  console.log("result")
  
  let groupCode = null;
  let systemControl = null;
  if (router.getCurrentNavigation().extras.state) {
      groupCode = router.getCurrentNavigation().extras.state['languageCode'];
      systemControl = router.getCurrentNavigation()?.extras.state['systemControl'];
  }
  let resolverUpdateData = of({});
  if (groupCode) {
      resolverUpdateData = db.getLanguage(groupCode);
  }

   return forkJoin([resolverUpdateData]).pipe(
      map((result) => {
          let detail = result[0];
          return { detail, systemControl};
      })
  );
}