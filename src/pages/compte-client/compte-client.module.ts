import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompteClientPage } from './compte-client';

@NgModule({
  declarations: [
    CompteClientPage,
  ],
  imports: [
    IonicPageModule.forChild(CompteClientPage),
  ],
})
export class CompteClientPageModule {}
