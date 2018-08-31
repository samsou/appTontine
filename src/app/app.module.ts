import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AccordionComponent } from '../components/accordion/accordion';
import { ClientOptions } from '../components/client/client';
import { EpargneOptions } from '../components/epargne/epargne';
import { TontineOptions } from '../components/tontine/tontine';
import { HomePage } from '../pages/home/home';
import { DataProvider } from '../providers/data/data';
import { MyApp } from './app.component';

// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AccordionComponent,
    ClientOptions,
    TontineOptions,
    EpargneOptions
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccordionComponent,
    ClientOptions,
    TontineOptions,
    EpargneOptions
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'fr' },
    DataProvider
  ]
})
export class AppModule { }
