import { Component, OnInit } from '@angular/core';
import { ListValue, ListValueLang, Dbmt04Service } from '../dbmt04.service';
import { FormDatasource } from '@app/shared/services/base.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, combineLatest, from, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/rowstate.enum';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { NotifyService } from '@app/core/services/notify.service';

@Component({
  selector: 'app-list-value-detail',
  templateUrl: './list-value-detail.component.html',
  styleUrl: './list-value-detail.component.scss',
})
export class ListValueDetailComponent
  extends SubscriptionDisposer
  implements OnInit
{
  master = { langCodes: [] as any[] };
  dbListValue: ListValue = { listValueLangs: [] } as ListValue;

  dbListValueDataSource!: FormDatasource<ListValue>;
  dbListValueLangDataSources: FormDatasource<ListValueLang>[] = [];
  groupCode: string;
  canEdit: boolean;

  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private util: FormUtilService,
    private ms: NotifyService,
    private modal: ModalService,
    private db: Dbmt04Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.dbListValue = data.dbmt04.detail;
      this.groupCode = data.dbmt04.groupCode;
      this.master.langCodes = data.dbmt04.master.langCodes;
      this.dbListValue.groupCode = this.groupCode;
      this.canEdit = data.dbmt04.canEdit;
      this.rebuildForm();
    });
  }

  createListValueForm() {
    const fg = this.fb.group({
      groupCode: [null, [Validators.required, Validators.maxLength(20)]],
      value: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(200)]],
      parentGroupCode: [null, [Validators.maxLength(20)]],
      parentValue: [null, [Validators.maxLength(100)]],
      sequence: null,
      // interfaceMappingCode: [null, [Validators.maxLength(20)]],
      active: true,
      color: null,
    });
    return fg;
  }

  createListValueLangForm(valueLang: ListValueLang) {
    const fg = this.fb.group({
      valueText: [null, [Validators.required]],
    });
    return fg;
  }

  rebuildForm() {
    this.dbListValueDataSource = new FormDatasource<ListValue>(
      this.dbListValue,
      this.createListValueForm()
    );
    this.dbListValueDataSource.form.markAsPristine();

    this.dbListValueLangDataSources = [];
    this.master.langCodes.forEach((lang) => {
      let language = this.dbListValue.listValueLangs.find(
        (x) => x.languageCode == lang.value
      );
      if (!language) {
        language = new ListValueLang();
        language.languageCode = lang.value;
        language.groupCode = this.groupCode;
      }
      language.langName = lang.text;
      const langDataSource = new FormDatasource<ListValueLang>(
        language,
        this.createListValueLangForm(language)
      );
      this.dbListValueLangDataSources.push(langDataSource);

      if (!this.canEdit) {
        this.dbListValueDataSource.form.disable();
        this.dbListValueLangDataSources.forEach((x) => {
          x.form.disable();
        });
      } else if (this.dbListValue.rowState != RowState.Add) {
        this.dbListValueDataSource.form.controls['groupCode'].disable({
          emitEvent: false,
        });
        this.dbListValueDataSource.form.controls['value'].disable({
          emitEvent: false,
        });
      } else {
        this.dbListValueDataSource.form.controls['groupCode'].disable({
          emitEvent: false,
        });
      }
    });
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.dbListValueDataSource.form);
    if (this.dbListValueDataSource.form.invalid) invalid = true;

    if (this.dbListValueLangDataSources.some((source) => source.form.invalid)) {
      this.dbListValueLangDataSources.map((source) =>
        this.util.markFormGroupTouched(source.form)
      );
      invalid = true;
    }

    if (invalid) {
      this.ms.warning('message.STD00027', ['required data']);
      return;
    }
    this.dbListValueDataSource.updateValue();

    this.dbListValueLangDataSources.forEach((dataSource) => {
      dataSource.updateValue();
    });

    const valueLangs = this.dbListValueLangDataSources
      .filter((source) => !source.isNormal)
      .map((source) => source.model);
    this.dbListValue.listValueLangs = valueLangs;

    this.db
      .saveListValue(this.dbListValue)
      .pipe(
        switchMap(() =>
          this.db.getListValueByGroupAndValue(
            this.dbListValue.groupCode,
            this.dbListValue.value
          )
        )
      )
      .subscribe((data) => {
        this.dbListValue = data;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
  }

  public get isDirty() {
    return (
      this.dbListValueDataSource.form.dirty ||
      this.dbListValueLangDataSources.some((source) => source.form.dirty)
    );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      return from(this.modal.confirm('message.STD00002'));
    }
    return of(true);
  }

  cancel() {}
}
