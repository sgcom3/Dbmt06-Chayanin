import { FormGroup } from '@angular/forms';
import { Guid } from 'guid-ts';
import { RowState } from '../rowstate.enum';
import { BehaviorSubject, Subject } from 'rxjs';


export class FormDatasource<M extends EntityBase> {
    id!: string;
    model: M;
    form:FormGroup;
    formName:{ [key: string]: FormGroup};
    formChange:Subject<FormGroup>=new Subject<FormGroup>();
    private formGroup?: { [key: string]: FormGroup };
    constructor(model: M, form?: FormGroup) {
        this.id = Guid.newGuid().toString();
        this.model = model;
        if (!model.guid) {
            this.model.guid = Guid.newGuid().toString();
        }
        if (model.rowState == null || model.rowState == undefined)
            this.model.rowState = RowState.Add;
        this.formGroup = {};
        if (form) {
            this.createForm(form, this.id);
        }
    }

    createForm(form: FormGroup, name: string = this.id) {
        form.valueChanges.subscribe(() => {
            if (!form.pristine && this.model.rowState === RowState.Normal) {
                this.model.rowState = RowState.Edit;
            }
            this.formChange.next(form);
        })
        form.patchValue(this.model);
        this.formGroup[name] = form;
        if(name === this.id) this.form = this.formGroup[name];
        else {
            Object.assign(this.formName,{ name:this.formGroup[name]});
        }
    }

    patchValue(name:string=this.id){
        this.formGroup[name]?.patchValue(this.model);
        this.formChange.next( this.formGroup[name]);
    }
    
    updateValue() {
        Object.values(this.formGroup).forEach((form: FormGroup) => {
            Object.assign(this.model, form.getRawValue());
            this.formChange.next(form);
        })
    }

    get isAdd() {
        return this.model.rowState === RowState.Add;
    }

    get isDelete() {
        return this.model.rowState === RowState.Delete;
    }

    get isNormal() {
        return this.model.rowState === RowState.Normal;
    }

    get isEdit() {
        return this.model.rowState === RowState.Edit;
    }
    
    markToNormal() {
        this.model.rowState = RowState.Normal;
    }

    markForDelete() {
        this.model.rowState = RowState.Delete;
    }

    markToEdit(){
        this.model.rowState = RowState.Edit;
    }

}

export class EntityBase {
    guid: string;
    rowState: RowState;
    rowVersion: string;
    constructor() {
        this.guid = Guid.newGuid().toString();
        this.rowState = RowState.Add;
    }
    get isEdit() {
        return this.rowState === RowState.Edit;
    }
    markToEdit(){
        this.rowState = RowState.Edit;
    }
}

export class BaseList {
    guid: string;
    rowState: RowState;
    constructor() {

        this.guid = Guid.newGuid().toString();
        this.rowState = RowState.Add;
    }
}