import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RelevePage } from './releve';

@NgModule({
  declarations: [
    RelevePage,
  ],
  imports: [
    IonicPageModule.forChild(RelevePage),
  ],
  providers: [
    DatePipe,
    CurrencyPipe
  ]
})
export class RelevePageModule { }
