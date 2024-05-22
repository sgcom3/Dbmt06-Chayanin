import { Injectable } from '@angular/core';
import { Guid } from 'guid-ts';
import { merge } from 'rxjs';

interface Saver {
  data: any,
  type: string
}
@Injectable({
  providedIn: 'root',
})
export class SaveDataService {
  private dateRegex = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;
  private internalKey = Guid.newGuid().toString();

  constructor(/*private comService: CompanyService, private orgService: OrganizationService*/) {
    // merge(*this.comService.company, */this.orgService.organization).subscribe(() => {
      this.clearSaveData();
    // })
  }

  clearSaveData(): void {
    Object.keys(sessionStorage).filter(key => {
      return key.includes(this.internalKey);
    }).map(key => sessionStorage.removeItem(key));
  }

  clear(key: string): void {
    sessionStorage.removeItem(`${this.internalKey}.${key}`);
  }

  private convertDates(object: any): void {
    if (!object || typeof object !== 'object') {
      return;
    }
  
    if (Array.isArray(object)) {
      object.forEach((item) => this.convertDates(item));
    }
  
    Object.keys(object).forEach((key) => {
      const value = object[key];
  
      if (Array.isArray(value)) {
        value.forEach((item) => this.convertDates(item));
      }
  
      if (typeof value === 'object') {
        this.convertDates(value);
      }
  
      if (typeof value === 'string' && this.dateRegex.test(value)) {
        object[key] = new Date(value);
      }
    });
  }

  save(data: any, key: string) {
    let dataType: string = typeof data;
    let dataString: string;
    if (dataType !== "object") {
      dataString = String(data);
    }
    else if (data instanceof Date) {
      dataString = data ? data.getTime().toString() : null;
      dataType = "date";
    }
    else {
      dataString = JSON.stringify(data);
    }
    const saveData = {
      data: dataString,
      type: dataType
    }
    sessionStorage.setItem(`${this.internalKey}.${key}`, JSON.stringify(saveData));
  }

  retrive(key: string) {
    const dataStore = sessionStorage.getItem(`${this.internalKey}.${key}`);
    if (dataStore) {
      const saveData: Saver = JSON.parse(dataStore);
      switch (saveData.type) {
        case 'string':
          return saveData.data;
        case 'number':
          return Number(saveData.data);
        case 'boolean':
          return saveData.data as boolean;
        case 'date':
          return saveData.data ? new Date(saveData.data) : null;
        case 'object':
          let obj = JSON.parse(saveData.data);
          this.convertDates(obj);
          return obj;
        default:
          return null;
      }
    }
    else return null;
  }
}