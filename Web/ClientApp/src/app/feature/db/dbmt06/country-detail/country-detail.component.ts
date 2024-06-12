import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Country, CountryLang, Dbmt06Service, dropdown } from '../dbmt06.service';
import { FormDatasource } from '@app/shared/services/base.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifyService } from '@app/core/services/notify.service';
import { FormUtilService } from '@app/shared/services/form-util.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { RowState } from '@app/shared/rowstate.enum';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'x-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
})
export class CountryDetailComponent
  extends SubscriptionDisposer
  implements OnInit {
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
  regionOptions: dropdown[] = [];
  currencyOptions: { label: string; value: string }[] = [];

  saving = false;
  data: any[] = [];

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
    //this.createDbCountry();
    this.route.data.subscribe((data: any) => {
      if (data?.dbmt06?.detail) {
        this.country = data.dbmt06.detail;

        this.regions = Array.isArray(data.dbmt06.regions)
          ? data.dbmt06.regions
          : [];
        this.regionTemp = [...this.regions];

        this.currencies = Array.isArray(data.dbmt06.currencies)
          ? data.dbmt06.currencies
          : [];
        this.countryCode = data.dbmt06.countryCode;
        this.currencyTemp = [...this.currencies];

        if (data.dbmt06.master?.langCodes) {
          this.master.langCodes = data.dbmt06.master.langCodes;
        } else {
          this.master.langCodes = []; // or handle the case where langCodes is not available
        }

        this.country.countryCode = this.countryCode;
        //this.canEdit = data.dbmt06.canEdit;

        this.rebuildForm();
        this.cdr.markForCheck();
      }

      this.db.getRegionOptions().subscribe((data) => {
        this.regionOptions = data;
      });

      this.db.getCurrencyOptions().subscribe((data) => {
        this.currencyOptions = data;
      });
      //this.loadRegions();
      //this.rebuildForm();
      // this.cdr.markForCheck(); // Mark for check
    });
  }

  createDbCountry() {
    return this.fb.group({
      countryCode: [null, [Validators.required, Validators.maxLength(20)]],
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
    return this.fb.group({
      countryName: [null, [Validators.required, Validators.maxLength(300)]],
    });
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
        (x) => x.languageCode == lang.value
      );
      if (!language) {
        language = new CountryLang();
        language.languageCode = lang.value;
        language.countryCode = this.countryCode;
      }
      const langDataSource = new FormDatasource<CountryLang>(
        language,
        this.createCountryLangForm(language)
      );
      this.dbCountryLangForm.push(langDataSource);
      console.log('langDataSource', langDataSource);
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

    console.log('dataSource', DataSource);

    this.dbCountryLangForm.forEach((dataSource) => {
      dataSource.updateValue();
    });

    const countryLangs = this.dbCountryLangForm
      .filter((source) => !source.isNormal)
      .map((source) => source.model);
    this.country.countryLangs = countryLangs;
    //this.country.countryName = this.country.countryLangs[0].countryName;

    console.log('country', this.country);
    //let getcountry = this.db.getCountryByCountryCode(this.country.countryCode);
    //console.log('getCountryByCountryCode', getcountry);

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

  // updateTableData() {
  //   // Define your pagination and query parameters
  //   const page = { pageNumber: 1, pageSize: 10 }; // Example pagination parameters
  //   const query = ''; // Example query string

  //   this.db.getCountries(page, query).subscribe((response) => {
  //     this.data = response.items; // Assuming response contains items array
  //     this.cdr.markForCheck(); // Ensure Angular checks for changes
  //   });
  // }



}
