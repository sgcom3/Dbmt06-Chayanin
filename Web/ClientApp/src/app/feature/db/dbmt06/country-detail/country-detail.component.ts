import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Country, Dbmt06Service } from '../dbmt06.service';
import { FormDatasource } from '@app/shared/services/base.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '@app/core/services/notify.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Observable, from, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/rowstate.enum';

@Component({
  selector: 'x-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent
  extends SubscriptionDisposer
  implements OnInit
{
  dbCountryForm!: FormDatasource<Country>;
  Country: Country = {} as Country;
  regions: any = [];
  regionTemp: any = [];
  currencies: any = [];
  currencyTemp: any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private util: FormUtilService,
    private ms: NotifyService,
    private db: Dbmt06Service,
    private modal: ModalService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    super();

    this.dbCountryForm = new FormDatasource<Country>(
      this.Country,
      this.createDbCountry()
    );
  }

  ngOnInit(): void {
    //this.createDbCountry();
    this.route.data.subscribe((data: any) => {
      console.log('data:', data);

      if (data.dbmt06 && data.dbmt06.detail) {
        this.Country = data.dbmt06.detail;

        this.regions = data.dbmt06.regions || [];
        this.regionTemp = [...this.regions];

        this.currencies = data.dbmt06.currencies || [];
        this.currencyTemp = [...this.currencies];

        this.rebuildForm();
        this.cdr.markForCheck();
        // if (data.dbmt06 && data.dbmt06.regions) {
        //   this.regions = data.dbmt06.regions;
        //   this.regionTemp = JSON.parse(JSON.stringify(this.regions));
        // } else {
        //   this.regions = [];
        //   this.regionTemp = [];
        // }

        // if (data.dbmt06 && data.dbmt06.currencies) {
        //   this.currencies = data.dbmt06.currencies;
        //   this.currencyTemp = JSON.parse(JSON.stringify(this.currencies));
        // } else {
        //   this.currencies = [];
        //   this.currencyTemp = [];
        // }
      }
      // this.rebuildForm();
      // this.cdr.markForCheck(); // Mark for check
    });
  }

  createDbCountry() {
    // need Validation check later
    return this.fb.group({
      countryCode: [null, [Validators.required, Validators.maxLength(20)]],
      countryName: [null, [Validators.required]],
      description: [null, [Validators.maxLength(200)]],
      active: [true],
      region: [null, [Validators.maxLength(20)]],
      currencyData: [null, [Validators.maxLength(20)]],
      telCountryCode: [null],
      trunkPrefix: [null],
      interfaceMappingCode: [null],
    });
    // return fg;
  }

  rebuildForm() {
    this.dbCountryForm = new FormDatasource<Country>(
      this.Country,
      this.createDbCountry()
    );

    console.log('Form Before Patch:', this.dbCountryForm.form.value);
    this.dbCountryForm.form.patchValue(this.Country); // Patch form with Country data
    console.log('Form After Patch:', this.dbCountryForm.form.value);

    // if edit
    this.dbCountryForm.form.markAsPristine();

    if (this.Country.rowState != RowState.Add) {
      this.dbCountryForm.form.controls['countryCode'].disable();
    }
    this.dbCountryForm.form.controls['countryCode'].valueChanges
      .pipe()
      .subscribe((x) => {
        this.regionChange(x);
        this.currencyChange(x);
      });
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.dbCountryForm.form);
    if (this.dbCountryForm.form.invalid) invalid = true;

    if (invalid) {
      this.ms.warning('message.STD00027', ['required data']);
      return;
    }

    this.dbCountryForm.updateValue();
    this.db
      .saveCountry(this.Country)
      .pipe(
        switchMap(() =>
          this.db.getCountryByCountryCode(this.Country['countryCode'])
        )
      )
      .subscribe((res) => {
        this.Country = res;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
  }

  public get isDirty() {
    return this.dbCountryForm.form.dirty;
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      return from(this.modal.confirm('message.STD00002'));
    }
    return of(true);
  }

  cancel() {}

  regionChange(value) {
    let regionModel = {
      territoryName: value,
    };
    let hasValue = this.regions.find(
      (x) => x.territoryName == this.dbCountryForm.form.controls['region'].value
    );
    let hasValueTemp = this.regionTemp.find(
      (x) => x.territoryName == this.dbCountryForm.form.controls['region'].value
    );
    this.regions = [...this.regionTemp, regionModel];
    if (
      hasValueTemp &&
      this.dbCountryForm.form.controls['region'].value &&
      !hasValue
    ) {
      this.dbCountryForm.form.controls['region'].setValue(value);
    } else if (
      hasValue &&
      this.dbCountryForm.form.controls['region'].value &&
      hasValueTemp == undefined
    ) {
      this.dbCountryForm.form.controls['region'].setValue(value);
    }
  }

  currencyChange(value) {
    let currencyModel = {
      currencyData: value,
    };
    let hasValue = this.currencies.find(
      (x) =>
        x.currencyData == this.dbCountryForm.form.controls['currencyData'].value
    );
    let hasValueTemp = this.currencyTemp.find(
      (x) =>
        x.currencyData == this.dbCountryForm.form.controls['currencyData'].value
    );
    this.currencies = [...this.currencyTemp, currencyModel];
    if (
      hasValueTemp &&
      this.dbCountryForm.form.controls['currencyData'].value &&
      !hasValue
    ) {
      this.dbCountryForm.form.controls['currencyData'].setValue(value);
    } else if (
      hasValue &&
      this.dbCountryForm.form.controls['currencyData'].value &&
      hasValueTemp == undefined
    ) {
      this.dbCountryForm.form.controls['currencyData'].setValue(value);
    }
  }
}
