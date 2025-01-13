import { Component, EventEmitter, Input, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import { IonLabel, IonNote, IonToast, IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonIcon, IonTabButton, IonTabBar, IonRouterOutlet, IonButton, IonButtons, IonCard, IonMenu, IonMenuButton, IonModal, IonInput, IonItem, IonLoading, IonSpinner, IonProgressBar } from '@ionic/angular/standalone';
import { SearchComponent } from '../search/search.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core';
import { Key } from '../model/key';
import { Capacitor } from '@capacitor/core';
import { FormsModule } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  // providers:[StorageService],
  imports: [IonProgressBar, FormsModule, IonNote, IonLabel, IonToast, IonSpinner, IonLoading, IonItem, IonInput, IonModal, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonTabs, IonIcon, IonTabButton, IonTabBar, IonRouterOutlet, IonButton, IonButtons, SearchComponent, InventoryComponent, IonCard, IonMenu, IonMenuButton],

})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;
  @ViewChild('modal2', { static: false }) modal2: IonModal | undefined;
  @ViewChild(IonLoading) uploading: IonLoading | undefined;
  @ViewChild(IonToast, { static: false }) toast: IonToast | undefined;
  selected: "search" | "inventory" = "search";
  view: "delete" | "upload" = "delete";
  isOpen: boolean = false;
  loading: boolean = false;
  updloadFlag: boolean = false;
  makeList: string[] = [];
  modelList: string[] = [];
  trimList: string[] = [];
  url: string = "";
  showSend = false;
  sending = false;
  event = new EventEmitter();
  @Input() key: Key | undefined;
  private storageService = inject(StorageService);

  // constructor(private file: File) {  }
  openMenu() {
    this.isOpen = !this.isOpen;
  }
  select(val: "search" | "inventory") {
    this.selected = val;
    if (val === "search") {
      this.init();
    }
  }

  ngOnInit() {
    this.init();
  }

  init() {
    setTimeout(() => {
      this.storageService.getUniqueMakes().then((result) => {
        this.makeList = result;
        console.log('Unique Models:', this.makeList);
      });
      this.storageService.getUniqueModels().then((result) => {
        this.modelList = result;
        console.log('Unique Models:', this.modelList);
      });
      this.storageService.getUniqueTrims().then((result) => {
        this.trimList = result;
        console.log('Unique Models:', this.trimList);
      });
    }, 500);

  }

  clearDatabaseView() {
    this.view = "delete";
  };
  clearDatabase() {
    this.storageService.clearDatabase();
  }

  onWillDismiss(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.clearDatabase();
      this.event.emit("reset");
    }
  }

  onWillDismiss2(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    // const ev = event as CustomEvent<OverlayEventDetail<string>>;
    // if (ev.detail.role === 'confirm') {
    //   this.clearDatabase();
    //   this.event.emit("reset");
    // }
  }

  confirm() {
    this.modal?.dismiss(null, 'confirm');
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  handleEvent(event: { action: string; data: any; }) {
    if (event.action === "edit") {
      this.key = event.data;
      this.selected = "inventory";
    }
  }


  async checkPermissions(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      const status = await Filesystem.checkPermissions();
      if (status.publicStorage !== 'granted') {
        const result = await Filesystem.requestPermissions();
        return result.publicStorage === 'granted';
      }
      return true;
    }
    return false; // Assume permissions are granted in web
  }

  showSendData() {
    this.showSend = !this.showSend;
  }
  async downloadDatabase() {
    this.sending = true;
    this.storageService.sendData(this.url).then((response) => {
    }).finally(() => {
      this.sending = false;
    });
    // const hasWritePermission = await this.checkPermissions();

    // if (!hasWritePermission) {
    //   console.error('Permission not granted to write to external storage');
    //   return;
    // }
    // try {
    //   const response = await this.storageService.getAllKeys();
    //   const data = JSON.stringify(response, null, 2);

    //   const result = await Filesystem.writeFile({
    //     path: `keys_${new Date().toISOString()}.json`,
    //     data,
    //     directory: Directory.Documents,
    //     encoding: Encoding.UTF8
    //   });

    //   //   const url = result.uri;

    //   //   await Browser.open({
    //   //     url,
    //   //     presentationStyle: 'popover'
    //   //   });

    // } catch (error) {
    //   console.error('Error downloading keys:', error);
    // }
    // this.storageService.getAllKeys().then(async (response) => {
    //   const data = JSON.stringify(response, null, 2);
    //   const blob = new Blob([data], { type: 'application/json' });
    //   const url = URL.createObjectURL(blob);
    //   await Browser.open({
    //     url,
    //     // url: "https://drive.google.com/file/d/1x9OyLFZnnmIYFTzP5uJpgJsYox_7XugF/view?usp=sharing",
    //     presentationStyle: 'popover'
    //   });
    //   setTimeout(() => {
    //     URL.revokeObjectURL(url);
    //     console.log('Blob URL revoked');
    //   }, 2000);
    //   // alert("TEST download");
    //   // window.confirm(data);
    //   // const a = document.createElement('a');
    //   // a.href = url;
    //   // a.download = `keys_${new Date().toISOString()}.json`;
    //   // a.click();
    //   // URL.revokeObjectURL(url);
    // });
    // const filePath = this.file.dataDirectory + fileName;
    // for iOS use this.file.documentsDirectory

    // this.nativeHTTP.downloadFile('your-url', {}, {}, filePath).then(response => {
    // // prints 200
    // console.log('success block...', response);
    // }).catch(err => {
    // // prints 403
    // console.log('error block ... ', err.status);
    // // prints Permission denied
    // console.log('error block ... ', err.error);
    // })
    // await this.storageService.downloadDatabaseAsJson().then((response) => {
    // });
  }
  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploading?.present();
      const file = input.files[0];
      const fileContent = await file.text();
      try {
        const data: Key[] = JSON.parse(fileContent);
        await this.storageService.uploadDataFromJson(data).then((res) => {
          this.toast?.present();
          this.event.emit("reset");
        }).finally(() => {
          this.uploading?.dismiss();
          this.modal2?.dismiss();
        });
        console.log('Data uploaded successfully');
      } catch (error) {
        this.uploading?.dismiss();
        this.modal2?.dismiss();
        console.error('Error parsing JSON:', error);
      }
    }
  }
}
