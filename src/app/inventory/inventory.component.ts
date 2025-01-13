import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject, model } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonTextarea, IonButtons, IonIcon, IonAccordionGroup, IonAccordion, IonCard, IonToolbar, IonPopover, IonToast } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { SelectInsertComponent } from '../select-insert/select-insert.component';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../services/storage.service';
import { Key } from '../model/key';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  imports: [IonToast, IonPopover, ReactiveFormsModule, CommonModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton, IonButtons, IonTextarea, IonIcon, IonAccordionGroup, IonAccordion, IonCard, SelectInsertComponent],
  standalone: true
})
export class InventoryComponent implements OnInit {
  @ViewChild(IonToast, { static: false }) toast: IonToast | undefined;
  form: FormGroup;
  items: any[] = [];
  @Input() mode: "edit" | "insert" = "insert";
  @Input() makes: string[] = [];
  @Input() models: string[] = [];
  @Input() trims: string[] = [];
  @Input() key: Key | undefined;
  @Output() event = new EventEmitter();
  typeOptions: string[] = [];
  makerOptions: string[] = [];
  years: number[] = [];
  resetSelect = false;
  private storageService = inject(StorageService);

  constructor(private fb: FormBuilder) {
    addIcons({ ...icons });
    this.form = this.fb.group({
      id: [''],
      type: ['', Validators.required],
      maker: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      note: [''],
      vehicles: this.fb.array([this.createVehicleFormGroup()])
    });
  }

  createVehicleFormGroup(vehicle: any = {}): FormGroup {
    return this.fb.group({
      make: [vehicle.make || '', Validators.required],
      model: [vehicle.model || '', Validators.required],
      trim: [vehicle.trim || ''],
      yearFrom: [vehicle.yearFrom || null, [Validators.required, Validators.min(1990)]],
      yearTo: [vehicle.yearTo || null, [Validators.required, Validators.min(1990)]]
    });
  }

  ngOnInit(): void {
    // this.addItem();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.years.push(year);
    }
    this.initFilters();
    if (this.key && this.mode === "edit") {
      this.loadKeyData();
    }
  }

  loadKeyData() {
    this.form.patchValue({
      id: this.key?.id,
      type: this.key?.type,
      maker: this.key?.maker,
      quantity: this.key?.quantity,
      note: this.key?.note,
    });
    this.vehicles.clear();
    this.key?.vehicles.forEach(vehicle => {
      this.addVehicle(vehicle);
    });
  }

  addVehicle(vehicle: any = {}) {
    const vehicleForm = this.createVehicleFormGroup(vehicle);
    this.vehicles.push(vehicleForm);
  }

  initFilters() {
    setTimeout(() => {
      this.storageService.getUniqueMakers().then((result) => {
        this.makerOptions = result;
      });
      this.storageService.getUniqueTypes().then((result) => {
        this.typeOptions = result;
      });

    }, 500);
  }
  get vehicles() {
    return this.form.controls['vehicles'] as FormArray<FormGroup>;
  }


  addItem() {
    this.vehicles.push(this.createVehicleFormGroup());
  }

  incrementQuantity() {
    const newValue = this.form.get('quantity')?.value + 1;
    this.form.get('quantity')?.setValue(newValue);
  }

  decrementQuantity() {
    const currentQuantity = this.form.get('quantity')?.value;
    const newValue = currentQuantity - 1;
    if (newValue >= 1) {
      this.form.get('quantity')?.setValue(newValue);
    }
  }

  onSubmit(isUpdate?: boolean) {
    if (this.form.valid) {
      if (!isUpdate) {
        const id = uuidv4();
        this.form.get('id')?.setValue(id);
      }
      this.storageService.storeKey(this.form.value).then((res) => {
        this.form.reset();
        this.resetSelect = true;
        setTimeout(() => this.resetSelect = false, 0);
        this.initFilters();
        this.toast?.present();
        if (this.mode === "edit") {
          this.event.emit({ action: "edit", data: "success" });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  save() {
    this.onSubmit(true);
  }

  cancel() {
    this.event.emit({ action: "edit", data: "cancel" });
  }

  deleteCompatibleVehicle(index: number) {
    this.vehicles.removeAt(index);
  }

}
