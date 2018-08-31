import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { AccueilPage } from './accueil';

@NgModule({
  declarations: [
    AccueilPage,
  ],
  imports: [
    IonicPageModule.forChild(AccueilPage),
    ComponentsModule
  ]
})
export class AccueilPageModule { }
