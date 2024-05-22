import { Component, OnInit } from '@angular/core';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/services/base.service';
import { ListGroup, Dbmt04Service } from '../dbmt04.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest, from, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/rowstate.enum';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'app-list-group-detail',
  templateUrl: './list-group-detail.component.html',
  styleUrl: './list-group-detail.component.scss',
})
export class ListGroupDetailComponent
  extends SubscriptionDisposer
  implements OnInit
{
  dbListGroupForm!: FormDatasource<ListGroup>;
  listGroup: ListGroup = {} as ListGroup;
  systemControl: boolean = false;
  parentGroupCodes: any;
  parentGroupCodesTemp: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private util: FormUtilService,
    private ms: NotifyService,
    private db: Dbmt04Service,
    private modal: ModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createDbListGroup();
    this.route.data.subscribe((data: any) => {
      if (data.dbmt04.detail) {
        this.listGroup = data.dbmt04.detail;
        this.systemControl = data.dbmt04.systemControl;
        this.parentGroupCodes = data.dbmt04.parentGroupCodes;
        this.parentGroupCodesTemp = JSON.parse(
          JSON.stringify(this.parentGroupCodes)
        );
        this.rebuildForm();
      }
    });
  }

  createDbListGroup() {
    const fg = this.fb.group({
      groupCode: [null, [Validators.required, Validators.maxLength(20)]],
      sequence: null,
      parentGroupCode: [null, [Validators.maxLength(20)]],
      description: [null, [Validators.maxLength(200)]],
      active: true,
      canInsert: true,
      canDelete: true,
      canEdit: true,
    });
    return fg;
  }

  rebuildForm() {
    this.dbListGroupForm = new FormDatasource<ListGroup>(
      this.listGroup,
      this.createDbListGroup()
    );
    this.dbListGroupForm.form.markAsPristine();
    if (this.listGroup.rowState != RowState.Add) {
      this.dbListGroupForm.form.controls['groupCode'].disable();
    }
    if (this.systemControl) {
      this.dbListGroupForm.form.controls['canInsert'].disable();
      this.dbListGroupForm.form.controls['canEdit'].disable();
      this.dbListGroupForm.form.controls['canDelete'].disable();
    }
    this.dbListGroupForm.form.controls['groupCode'].valueChanges
      .pipe()
      .subscribe((x) => {
        this.parentGroupCodeChange(x);
      });
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.dbListGroupForm.form);
    if (this.dbListGroupForm.form.invalid) invalid = true;

    if (invalid) {
      this.ms.warning('message.STD00027', ['required data']);
      return;
    }

    this.dbListGroupForm.updateValue();
    this.db
      .saveListGroup(this.listGroup)
      .pipe(
        switchMap(() =>
          this.db.getListGroupByGroupCode(this.listGroup['groupCode'])
        )
      )
      .subscribe((res) => {
        this.listGroup = res;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
  }

  public get isDirty() {
    return this.dbListGroupForm.form.dirty;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      return from(this.modal.confirm('message.STD00002'));
    }
    return of(true);
  }

  cancel() {}
  parentGroupCodeChange(value) {
    let parentGroupCodeModel = {
      groupCode: value,
    };
    let hasValue = this.parentGroupCodes.find(
      (x) =>
        x.groupCode ==
        this.dbListGroupForm.form.controls['parentGroupCode'].value
    );
    let hasValueTemp = this.parentGroupCodesTemp.find(
      (x) =>
        x.groupCode ==
        this.dbListGroupForm.form.controls['parentGroupCode'].value
    );
    this.parentGroupCodes = [
      ...this.parentGroupCodesTemp,
      parentGroupCodeModel,
    ];
    if (
      hasValueTemp &&
      this.dbListGroupForm.form.controls['parentGroupCode'].value &&
      !hasValue
    ) {
      this.dbListGroupForm.form.controls['parentGroupCode'].setValue(value);
    } else if (
      hasValue &&
      this.dbListGroupForm.form.controls['parentGroupCode'].value &&
      hasValueTemp == undefined
    ) {
      this.dbListGroupForm.form.controls['parentGroupCode'].setValue(value);
    }
  }
}
