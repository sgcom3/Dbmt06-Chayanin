import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EntityBase } from "@app/shared/services/base.service";

export class ListGroup extends EntityBase {
    groupCode: string = null;
    sequence: number = null;
    parentGroupCode: string = null;
    description: string = null;
    active: boolean = true;
    canInsert: boolean = true;
    canDelete: boolean = true;
    canEdit: boolean = true;
}

export class ListValue extends EntityBase {
    valueId: string = null; //guid
    groupCode: string = null;
    value: string = null;
    description: string = null;
    parentGroupCode: string = null;
    parentValue: string = null;
    sequence: number = null;
    //interfaceMappingCode: string = null;
    active: boolean = true;
    color: string = null
    listValueLangs: ListValueLang[]
}

export class ListValueLang extends EntityBase {
    groupCode: string = null;
    id: string = null; 
    value: string = null;
    valueText: string = null;
    languageCode: string = null;
    langName: string = null;
}

@Injectable({
    providedIn: 'root'
})
export class Dbmt04Service {
    constructor(private http: HttpClient) { }

    getSearchListGroup(page: any, query: string) {
        const filter = Object.assign(query, page);
        return this.http.get<any>('dbmt04/SearchListGroup', { params: filter });
    }

    deleteListGroup(code: string) {
        return this.http.delete('dbmt04/DeleteListGroup', { params: { groupCode: code } })
    }

    getListGroupByGroupCode(code: string) {
        return this.http.get<ListGroup>('dbmt04/GetListGroupByGroupCode', { params: { groupCode: code } });
    }

    searchListValue(page: any, obj: any) {
        const filter = Object.assign(obj, page);
        return this.http.get<any>('dbmt04/SearchListValue', { params: filter });
    }

    deleteListValue(code: string) {
        return this.http.delete('dbmt04/DeleteListValue', { params: { valueId: code } })
    }

    getListValueByValueId(code: number) {
        return this.http.get<any>('dbmt04/GetListValueByValueId', { params: { valueId: code } });
    }

    getMaster() {
        return this.http.get<any>('dbmt04/master');
    }

    saveListGroup(dbListGroup: ListGroup) {
        return this.http.post('dbmt04/SaveListGroup', dbListGroup);
    }

    saveListValue(dbListValue: ListValue) {
        return this.http.post('dbmt04/SaveListValue', dbListValue);
    }

    getListValueByGroupAndValue(groupCode: string, value: string) {
        return this.http.get<any>('dbmt04/GetListValueByGroupAndValue', { params: { groupCode: groupCode, value: value } });
    }

    getParentGroupCode() {
        return this.http.get<any>('dbmt04/parentGroupCode');
    }
}