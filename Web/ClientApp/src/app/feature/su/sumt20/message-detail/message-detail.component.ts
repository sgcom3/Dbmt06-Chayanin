import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { NotifyService } from '@app/core/services/notify.service';
import { Message, Sumt20Service } from '../sumt20.service';
import { FormDatasource } from '@app/shared/services/base.service';
import { RowState } from '@app/shared/rowstate.enum';

@Component({
  selector: 'x-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.scss',
  providers: [Sumt20Service]
})
export class MessageDetailComponent {
  messageForm!: FormDatasource<Message>;
  message: Message = {} as Message;
  language;
  selectedLang:string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private util: FormUtilService,
    private ms: NotifyService,
    private db: Sumt20Service,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.createMessage();
    this.route.data.subscribe((data: any) => {
      if (data.sumt20.detail) {
        this.message.languageCode = data.sumt20.detail.languageCode;
        this.selectedLang = data.sumt20.detail.languageCode;
        this.message.messageCode = data.sumt20.detail.messageCode;
        this.message.remark = data.sumt20.detail.remark;
        this.message.rowState = data.sumt20.detail.rowState;
        this.message.messageDesc = data.sumt20.detail.messageDesc;
        this.rebuildForm();
        this.fetchLanguages();
      }
    });
  }

  createMessage(): FormGroup {
    return this.fb.group({
      messageCode: [null, [Validators.required, Validators.maxLength(20)]],
      languageCode: [null, [Validators.required, Validators.maxLength(20)]],
      messageDesc: [null, [Validators.maxLength(200)]],
      remark: [null, [Validators.maxLength(200)]]
    });
  }

  rebuildForm(): void {
    this.messageForm = new FormDatasource<Message>(
      this.message,
      this.createMessage()
    );
    this.messageForm.form.markAsPristine();
    if (this.message.rowState !== RowState.Add) {
      this.messageForm.form.controls['messageCode'].disable();
      this.messageForm.form.controls['languageCode'].disable();
    }
    this.messageForm.form.controls['messageCode'].valueChanges.subscribe((value) => {
      if (value && value.trim() === '') {
        this.messageForm.form.controls['messageCode'].setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
  }


  save(): void {
    this.util.markFormGroupTouched(this.messageForm.form);
    if (this.messageForm.form.invalid) {
      this.ms.warning('message.STD00027', ['required data']);
      return;
    }

    this.messageForm.updateValue();
    this.db.saveMessage(this.message)
      .pipe(
        switchMap(() => this.db.getMessageByCode(this.message['messageCode']))
      )
      .subscribe((res: any) => {
        this.message = res;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
  }

  public get isDirty(): boolean {
    return this.messageForm?.form?.dirty;
  }

  fetchLanguages(): void {
    this.db.getLanguage().subscribe(
      (response) => {
        if (response && Array.isArray(response.rows)) {
          this.language = response.rows.map(lang => ({ name: lang.languageCode, code: lang.languageCode }));
        } else {
          console.error('Expected an array, but received:', response);
        }
      },
      (error) => {
        console.error('Error fetching languages', error);
      }
    );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      return this.modal.confirm('message.STD00002');
    }
    return of(true);
  }

  cancel(): void {
  }
}
