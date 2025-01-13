import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { IonItem, IonLabel, IonSelect, IonSelectOption, IonToolbar, IonAccordionGroup, IonAccordion, IonButton, IonButtons, IonCard, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { KeyComponent } from '../key/key.component';
import { Key } from '../model/key';
import { StorageService } from '../services/storage.service';
import { InventoryComponent } from '../inventory/inventory.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [InventoryComponent, IonItem, IonLabel, IonSelect, IonSelectOption, CommonModule, IonButtons, IonButton, IonToolbar, IonAccordionGroup, IonAccordion, IonCard, IonContent, KeyComponent],
  standalone: true
})
export class SearchComponent implements OnInit {

  @Input() makes: string[] = [];
  @Input() models: string[] = [];
  @Input() trims: string[] = [];
  @Input() event = new EventEmitter();
  @Output() outputEvent = new EventEmitter();
  view: "inventory" | "search" = "search";
  updateKey: Key | undefined = undefined;
  years: string[] = [];
  list: Key[] = [];

  selectedMake: string = '';
  selectedModel: string = '';
  selectedTrim: string = '';
  selectedYear: string = '';
  private storageService = inject(StorageService);
  constructor() { }

  ngOnInit(): void {
    this.initializeYears();
    setTimeout(() => {
      this.getAllKeys();
    }, 500);
    this.event.subscribe((value) => {
      if (value === "reset") {
        this.clearFilters();
      }
    });
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.years.push(year.toString());
    }
  }

  getAllKeys() {
    this.storageService.getAllKeys().then((response: Key[]) => {
      this.list = response;
    });
  }

  clearFilters() {
    this.selectedMake = '';
    this.selectedModel = '';
    this.selectedTrim = '';
    this.selectedYear = '';
    this.getAllKeys();
  }

  search() {
    const year = Number(this.selectedYear);
    this.storageService.searchKeys(this.selectedMake, this.selectedModel, this.selectedTrim, year).then((response) => {
      this.list = response;
    });
  }

  onMakeSelected(event: string | any) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMake = selectElement.value;
    this.selectedModel = '';
    this.selectedTrim = '';
    this.selectedYear = '';
    // Update models based on selected make if necessary
  }

  onModelSelected(event: string | any) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedModel = selectElement.value;
    this.selectedTrim = '';
    this.selectedYear = '';
    // Update trims based on selected model if necessary
  }

  onTrimSelected(event: string | any) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTrim = selectElement.value;
    this.selectedYear = '';
    // Perform actions based on selected trim if necessary
  }

  onYearSelected(event: number | any) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedYear = selectElement.value;
    // Perform actions based on selected year if necessary
  }

  handleEvent(event: any) {
    if (event.action === "refresh") {
      this.getAllKeys;
    } else if (event.action === "edit") {
      this.updateKey = event.data;
      this.view = "inventory";
      // this.outputEvent.emit(event);
    }
  }

  cancelUpdate() {
    this.getAllKeys();
    this.view = "search";
  }
}
