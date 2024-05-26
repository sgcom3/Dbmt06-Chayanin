import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from '@app/core/services/notify.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { RowState } from '@app/shared/rowstate.enum';
import { FormDatasource } from '@app/shared/services/base.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { switchMap, Observable, from, of } from 'rxjs';
import { Dbmt20Service, LangList } from '../dbmt20.service';

@Component({
  selector: 'x-lang-detail',
  templateUrl: './lang-detail.component.html',
  styleUrl: './lang-detail.component.scss'
})
export class LangDetailComponent 
extends SubscriptionDisposer
implements OnInit
{
dblanguageForm!: FormDatasource<LangList>;
langList: LangList = {} as LangList;
systemControl: boolean = false;

constructor(
  private route: ActivatedRoute,
  private fb: FormBuilder,
  private util: FormUtilService,
  private ms: NotifyService,
  private db: Dbmt20Service,
  private modal: ModalService
) {
  super();
}

ngOnInit(): void {
  this.createDbListGroup();
  this.route.data.subscribe((data: any) => {
    console.log("test");
    console.log(data);
    if (data.dbmt20.detail) {
      this.langList = data.dbmt20.detail;
      this.systemControl = data.dbmt20.systemControl;
      this.rebuildForm();
    }
  });
}

createDbListGroup() {
  const fg = this.fb.group({
    languageCode: [null, [Validators.required, Validators.maxLength(20)]],
    description: [null, [Validators.maxLength(200)]],
    active: true
  });
  return fg;
}

rebuildForm() {
  this.dblanguageForm = new FormDatasource<LangList>(
    this.langList,
    this.createDbListGroup()
  );
  if (this.langList.rowState != RowState.Add) {
    this.dblanguageForm.form.controls['languageCode'].disable();
  }
}

save() {
  let invalid = false;
  this.util.markFormGroupTouched(this.dblanguageForm.form);
  if (this.dblanguageForm.form.invalid) invalid = true;
  if (invalid) {
    this.ms.warning('message.STD00027', ['required data']);
    return;
  }

  this.dblanguageForm.updateValue();
  this.db
    .saveLanguage(this.langList)
    .pipe(
      switchMap(() =>
        this.db.getLanguage(this.langList['languageCode'])
      )
    )
    .subscribe((res) => {
      this.langList = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
}

public get isDirty() {
  return this.dblanguageForm.form.dirty;
}

canDeactivate(): Observable<boolean> | boolean {
  if (this.isDirty) {
    return from(this.modal.confirm('message.STD00002'));
  }
  return of(true);
}

cancel() {}

}