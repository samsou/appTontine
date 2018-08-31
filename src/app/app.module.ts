import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
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

let firebaseConfig = {
  apiKey: "AIzaSyB7NuN8n3kCAJZBOSMpdEWSvw4ecvmzBFc",
  authDomain: "apptontine-cabfa.firebaseapp.com",
  databaseURL: "https://apptontine-cabfa.firebaseio.com",
  projectId: "apptontine-cabfa",
  storageBucket: "apptontine-cabfa.appspot.com",
  messagingSenderId: "745339778068"
};


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
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
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
