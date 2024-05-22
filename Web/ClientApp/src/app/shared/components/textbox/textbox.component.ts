import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'textbox',
  templateUrl: './textbox.component.html'
})
export class TextboxComponent extends BaseFormField implements OnChanges {
  @Input() floatLabel: boolean = false;
  @Input() helpText: string = "";
  @Input() axis: "horizontal" | "vertical" = "vertical"
  @Input() icon: string = ''
  @Input() iconPosition: 'left' | 'right' = 'left'
  @Input() helpTextClass: string = ''
  @Output() onInput: EventEmitter<any> = new EventEmitter<any>()

  ngOnChanges(changes: SimpleChanges) {
    if (changes["value"]) {
      this.value = this.value ?? '';
    }
  }
  override writeValue(value: any): void {
    this.value = value
  }

  onTextChange($event: any) {
    const value = $event?.target?.value;
    this.onChange(value);
    if (this.required) {
      const notEmpty = new RegExp(/\S+/);
      if (notEmpty.test(value)) {
        this.removeErrors(['empty'], this.control!);
        this.control?.updateValueAndValidity();
      }
      else {
        this.addErrors({ empty: true }, this.control!);
      }
    }
    this.value = value;
    this.onInput.next(this.value)
  }
}
