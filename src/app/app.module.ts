import { NgModule } from "@angular/core";
import { PreloadAllModules, RouteReuseStrategy, RouterModule, provideRouter, withPreloading } from "@angular/router";
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
@NgModule({
    // declarations: [
    // ],
    imports: [
      // BrowserModule,
      IonicStorageModule
    ],
    // providers: [
    //     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    //     provideRouter(routes, withPreloading(PreloadAllModules)),

    //     provideIonicAngular(),
    //   ],
    // bootstrap: [],
  })
  export class AppModule { }
  