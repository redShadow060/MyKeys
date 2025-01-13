import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject, output } from '@angular/core';
import { IonItem, IonLabel, IonSelect, IonSelectOption, IonToolbar, IonAccordionGroup, IonAccordion, IonButton, IonButtons, IonCard, IonIcon, IonMenu, IonMenuButton, IonModal, IonHeader, IonTitle, IonContent, IonInput, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Key } from '../model/key';
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core';
import { StorageService } from '../services/storage.service';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss'],
  imports: [IonBadge, FormsModule, IonInput, IonContent, IonTitle, IonHeader, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonToolbar, IonAccordionGroup, IonAccordion, IonButton, IonButtons, IonCard, CommonModule, IonMenu, IonMenuButton, IonModal, IonTitle],
  standalone: true
})

export class KeyComponent implements OnInit {
  getColor(arg: number | undefined) {
    if (!arg) return "primary";
    if (arg > 5) {
      return "success";
    } else if (arg > 1) {
      return "warning";
    } else {
      return "danger";
    }
  }

  @ViewChild(IonModal) modal: IonModal | undefined;
  @Input() data: Key = { vehicles: [] };
  @Output() event = new EventEmitter();
  // view: "update" | "delete" = "update";
  quantity: number = 0;
  show: boolean = false;
  private storageService = inject(StorageService);
  constructor() {
    addIcons({ ...icons });
  }

  ngOnInit(): void {
    this.quantity = this.data.quantity || 0;
  }

  onWillDismiss(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.data.quantity = this.quantity;
      this.storageService.updateKey(this.data);
    }
  }

  confirm() {
    this.modal?.dismiss(null, 'confirm');
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  decrementQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  incrementQuantity() {
    this.quantity++;
  }

  async open(view: "update" | "delete") {
    // this.view = view;
    await this.modal?.present();
  }

  confirmDelete() {
    this.modal?.dismiss(null, 'confirm');
  }

  cancelDelete() {
    this.modal?.dismiss(null, 'cancel');
  }

  deleteKey() {
    this.storageService.removeKey(this.data.id || "");
    this.modal?.dismiss(null, 'cancel');
    this.event.emit({ action: "reload" });
  }

  showConfirmation(arg: boolean) {
    this.show = arg;
  }

  editKey() {
    this.modal?.dismiss(null, 'cancel');
    this.event.emit({ action: "edit", data: this.data });
  }
}
