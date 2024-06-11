import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Country, Dbmt06Service } from '../dbmt06.service';

export const CountryDetailResolverService: ResolveFn<Observable<any>> = () => {
  const router = inject(Router);
  const db = inject(Dbmt06Service);

  let interfaceMappingCode = null;

  const code = <any>router.getCurrentNavigation()?.extras.state;
  let countryCode = null;

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

  const detail = code?.countryCode
    ? db.getCountryByCountryCode(code.countryCode)
    : of({ countryLangs: [] } as Partial<Country>);

  const master = db.getMaster();

  return forkJoin([detail, master]).pipe(
    map((result) => {
      let detail = result[0];
      let master = result[1];
      return {
        detail,
        master,
        countryCode,
        interfaceMappingCode: interfaceMappingCode,
      };
    })
  );
};
