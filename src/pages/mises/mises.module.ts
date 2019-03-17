import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisesPage } from './mises';

@NgModule({
  declarations: [
    MisesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisesPage),
  ],
})
export class MisesPageModule {}
