import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Dbmt06Service } from '../dbmt06.service';

export const CountryDetailResolverService: ResolveFn<Observable<any>> = () => {
  const router = inject(Router);
  const db = inject(Dbmt06Service);

  let countryCode = null;
  let interfaceMappingCode = null;
  if (router.getCurrentNavigation().extras.state) {
    countryCode = router.getCurrentNavigation().extras.state['countryCode'];
    interfaceMappingCode =
      router.getCurrentNavigation()?.extras.state['interfaceMappingCode'];
    console.log('print state', router.getCurrentNavigation().extras.state);
  }
  let resolverUpdateData = of({});
  if (countryCode) {
    resolverUpdateData = db.getCountryByCountryCode(countryCode);
  }

  return forkJoin([resolverUpdateData]).pipe(
    map((result) => {
      let detail = result[0];
      return { detail, interfaceMappingCode: interfaceMappingCode };
    })
  );
};
