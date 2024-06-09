import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Country, CountryLang, Dbmt06Service } from '../dbmt06.service';
import { FormDatasource } from '@app/shared/services/base.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '@app/core/services/notify.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/rowstate.enum';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'x-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent
  extends SubscriptionDisposer
  implements OnInit
{

  //dbCountryList: Country = { countryLangs: [] } as Country;
  master = { langCodes: [] as any[] };
  dbCountryForm!: FormDatasource<Country>;
  dbCountryLangForm: FormDatasource<CountryLang>[] = [];
  country: Country = { countryLangs: [] } as Country;
  countryCode: string;
  regions: any[] = [];
  regionTemp: any;
  currencies: any[] = [];
  currencyTemp: any;
  systemControl: any;
  regionOptions: any[] = [];
  regionList: any[] = [];
  currencyList: any[] = [];
  currencyOptions: { label: string; value: string }[] = [];

  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private util: FormUtilService,
    private ms: NotifyService,
    private db: Dbmt06Service,
    private modal: ModalService,
    private cdr: ChangeDetectorRef
  ) {
    super();

    // this.dbCountryForm = new FormDatasource<Country>(
    //   this.Country,
    //   this.createDbCountry()
    // );
  }

  ngOnInit(): void {
    
    this.createDbCountry();
    this.route.data.subscribe((data: any) => {
      console.log('data:', data);

      if (data.dbmt06 && data.dbmt06.detail) {
        this.country = data.dbmt06.detail;

        this.regions = Array.isArray(data.dbmt06.regions)
          ? data.dbmt06.regions
          : [];
        this.regionTemp = [...this.regions];

        this.currencies = Array.isArray(data.dbmt06.currencies)
          ? data.dbmt06.currencies
          : [];
        this.currencyTemp = [...this.currencies];

        this.rebuildForm();
        this.cdr.markForCheck();
      }

    });
    this.loadRegion();
    this.loadCurrency();
  }

  loadRegion(): void {
    this.db.getRegion().subscribe((regionList) => {
      this.regionList = regionList.rows.map(row => ({
        label: row.regionCode,
        value: row.regionCode 
      }));
    });
  }
  loadCurrency(): void {
    this.db.getCurrency().subscribe((currencyList) => {
      this.currencyList = currencyList.rows.map(row => ({
        label: row.currencyCode,
        value: row.currencyCode 
      }));
    });
  }
  

  createDbCountry() {
    return this.fb.group({
      countryCode: [null, [Validators.required, Validators.maxLength(20)]],
      countryName: [null, [Validators.required, Validators.maxLength(300)]],
      description: [null, [Validators.maxLength(300)]],
      active: [true],
      region: [null, [Validators.maxLength(20)]],
      currency: [null, [Validators.maxLength(20)]],
      telCountryCode: [null, Validators.pattern(/^\+\d{0,9}$/)],
      trunkPrefix: [null, [Validators.maxLength(10)]],
      interfaceMappingCode: [null, [Validators.maxLength(20)]],
    });
    //return fg;
  }

  createCountryLangForm(valueLang: CountryLang) {
    const fg = this.fb.group({
      countryName: [null, [Validators.required, Validators.maxLength(300)]],
    });
    return fg;
  }

  rebuildForm() {
    this.dbCountryForm = new FormDatasource<Country>(
      this.country,
      this.createDbCountry()
    );
    this.dbCountryForm.form.patchValue(this.country); // Patch form with Country data

    // if edit
    if (this.country.rowState != RowState.Add) {
      this.dbCountryForm.form.controls['countryCode'].disable();
    }

    this.dbCountryForm.form.markAsPristine();
    this.dbCountryLangForm = [];
    this.master.langCodes.forEach((lang) => {
      let language = this.country.countryLangs.find(
        (x) => x.languagecode == lang.value
      );
      if (!language) {
        language = new CountryLang();
        language.languagecode = lang.value;
        language.countrycode = this.countryCode;
      }
      const langDataSource = new FormDatasource<CountryLang>(
        language,
        this.createCountryLangForm(language)
      );
      this.dbCountryLangForm.push(langDataSource);
    });
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.dbCountryForm.form);
    if (this.dbCountryForm.form.invalid) invalid = true;

    if (this.dbCountryLangForm.some((source) => source.form.invalid)) {
      this.dbCountryLangForm.map((source) =>
        this.util.markFormGroupTouched(source.form)
      );
      invalid = true;
    }

    if (invalid) {
      this.ms.warning('message.STD00027', ['required data']);
      return;
    }

    this.dbCountryForm.updateValue();

    this.dbCountryLangForm.forEach((dataSource) => {
      dataSource.updateValue();
    });

    const countryLangs = this.dbCountryLangForm
      .filter((source) => !source.isNormal)
      .map((source) => source.model);
    this.country.countryLangs = countryLangs;

    this.db
      .saveCountry(this.country)
      .pipe(
        switchMap(() =>
          this.db.getCountryByCountryCode(this.country.countryCode)
        )
      )
      .subscribe((res) => {
        this.country = res;
        this.rebuildForm();
        this.ms.success('message.STD00006');
      });
  }

  public get isDirty() {
    return (
      this.dbCountryForm.form.dirty ||
      this.dbCountryLangForm.some((source) => source.form.dirty)
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
