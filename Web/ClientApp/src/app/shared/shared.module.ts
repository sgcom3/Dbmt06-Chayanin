import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgs } from './primeNg';
import { TextboxComponent } from './components/textbox/textbox.component';
import { AreaComponent } from './components/area/area.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumberComponent } from './components/number/number.component';
import { PrimeButtonDirective, PrimeRippleDirective } from './directives/prime-button.directive';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioComponent } from './components/radio/radio.component';
import { SwitchComponent } from './components/switch/switch.component';
import { ListboxComponent } from './components/listbox/listbox.component';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { SliderComponent } from './components/slider/slider.component';
import { RatingComponent } from './components/rating/rating.component';
import { KnobComponent } from './components/knob/knob.component';
import { ColorpickerComponent } from './components/colorpicker/colorpicker.component';
import { TogglebuttonComponent } from './components/togglebutton/togglebutton.component';
import { SelectbuttonComponent } from './components/selectbutton/selectbutton.component';
import { InputgroupComponent } from './components/inputgroup/inputgroup.component';
import { ChipsComponent } from './components/chips/chips.component';
import { MaskComponent } from './components/mask/mask.component';
import { PasswordComponent } from './components/password/password.component';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalService } from './components/modal/modal.service';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { Table } from 'primeng/table';
import { OrgchartComponent } from './components/orgchart/orgchart.component';
import { TabComponent } from './components/tab/tab.component';
import { TabView } from 'primeng/tabview';

const components = [
  TextboxComponent,
  AreaComponent,
  DropdownComponent,
  NumberComponent,
  PrimeButtonDirective,
  PrimeRippleDirective,
  AutocompleteComponent,
  CalendarComponent,
  CheckboxComponent,
  RadioComponent,
  SwitchComponent,
  ListboxComponent,
  MultiselectComponent,
  SliderComponent,
  RatingComponent,
  KnobComponent,
  ColorpickerComponent,
  TogglebuttonComponent,
  SelectbuttonComponent,
  InputgroupComponent,
  ChipsComponent,
  MaskComponent,
  PasswordComponent,
  TableComponent,
  ModalComponent,
  ConfirmComponent,
  BreadcrumbComponent,
  AttachmentComponent,
  OrgchartComponent,
  TabComponent
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    PrimeNgs,
    TranslateModule
  ],
  exports: [
    PrimeNgs,
    components,
    TranslateModule,
    ReactiveFormsModule
  ],
  providers: [
    DialogService,
    ModalService,
    Table,
    TabView 
  ]
})
export class SharedModule { }
