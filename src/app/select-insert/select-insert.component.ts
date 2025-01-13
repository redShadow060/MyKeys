import { Component, ElementRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonTextarea, IonButtons, IonIcon, IonAccordionGroup, IonAccordion, IonCard, IonToolbar } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-insert',
  templateUrl: './select-insert.component.html',
  styleUrls: ['./select-insert.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonButtons, IonTextarea, IonIcon, IonAccordionGroup, IonAccordion, IonCard],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInsertComponent),
      multi: true
    }
  ]
})
export class SelectInsertComponent {
  @ViewChild('input') input: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('mySelect') mySelect: ElementRef<HTMLSelectElement> | undefined;
  inputElement!: ElementRef;
  @Input() options: any[] = [];
  @Input() insert?: boolean = true;
  @Input() label?: string | undefined;
  @Input() set reset(value: boolean) {
    if (value) {
      this.value = "";
      this.mySelect?.nativeElement.setAttribute("selectedIndex", "-1");
      // Document.getElementById('mySelect').selectedIndex = -1;
    }
  }
  value: string = "";
  disabled: boolean | undefined;
  showInput: boolean = false;

  constructor() { }


  private onChange!: (value: any) => void;
  private onTouched!: () => void;

  writeValue(value: any): void {
    this.value = value;
    this.showInput = (value === 'insert-new');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.showInput = (selectElement.value === 'insert-new');
    this.value = this.showInput ? "" : selectElement.value;
    if (this.onChange) {
      this.onChange(this.value);
    }
    if (this.showInput) {
      setTimeout(() => {
        this.inputElement?.nativeElement.focus();
      }, 0);
    }
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value.toUpperCase();
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  removeInput(): void {
    this.value = '';
    this.showInput = false;
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

}
