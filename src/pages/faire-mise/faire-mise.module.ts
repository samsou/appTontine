import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaireMisePage } from './faire-mise';

@NgModule({
  declarations: [
    FaireMisePage,
  ],
  imports: [
    IonicPageModule.forChild(FaireMisePage),
  ],
})
export class FaireMisePageModule {}
