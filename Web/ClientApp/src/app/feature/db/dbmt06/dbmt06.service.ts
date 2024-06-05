import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBase } from '@app/models/entityBase';
import { Observable, catchError, map, of } from 'rxjs';

export class Country extends EntityBase {
  countryCode: string = null;
  telCountryCode: string = null;
  active: boolean = true;
  zoneId: number = null;
  currencyCode: string = null;
  trunkPrefix: string = null;
  description: string = null;
  countryImage: number = null;
  territoryCode: string = null;
  interfaceMappingCode: string = null;
  isEdit: any = null;
  markToEdit: any = null;
  countryName: string = null;
  territoryName: string = null;
  currencyName: string = null;
  countryLangs: CountryLang[];
}

export class CountryLang extends EntityBase {
  countrycode: string = null;
  languagecode: string = null;
  langName : string;
  countryname: string = null;
  isEdit: any = null;
  markToEdit: any = null;
}

@Injectable()
export class Dbmt06Service {
  constructor(private http: HttpClient) {}

  getCountries(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt06/Countries', { params: filter });
  }

  getRegions(): Observable<any[]> {
    return this.http.get<any[]>('dbmt06/Regions');
  }

  getCurrencies(): Observable<any[]> {
    return this.http.get<any[]>('dbmt06/Currencies');
  }

  getRegionOptions(): Observable<{ label: string; value: string }[]> {
    return this.http.get<any>('dbmt06/Regions').pipe(
      map((data) => {
        console.log(data);
        if (data && data.rows) {
          return data.rows.map((item) => ({
            label: item.territoryName,
            value: item.territoryName,
          }));
        }
      })
    );
  }

  getCurrencyOptions(): Observable<{ label: string; value: string }[]> {
    return this.http.get<any>('dbmt06/Currencies').pipe(
      map((data) => {
        console.log(data);
        if (data && data.rows) {
          return data.rows.map((item) => ({
            label: item.currencyName,
            value: item.currencyName,
          }));
        }
      })
    );
  }

  getCountryByCountryCode(code: string) {
    return this.http.get<Country>('dbmt06/GetCountryByCountryCode', {
      params: { countryCode: code },
    });
  }

  deleteCountry(code: string) {
    return this.http.delete('dbmt06/DeleteCountry', {
      params: { countryCode: code },
    });
  }

  saveCountry(dbCountry: Country) {
    return this.http.post('dbmt06/SaveCountry', dbCountry);
  }
  getRegion(){
    return this.http.get<any>('dbmt06/getRegions');
  }
}
