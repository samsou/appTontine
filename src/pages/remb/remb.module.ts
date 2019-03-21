import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PipesModule } from '../../pipes/pipes.module';
import { RembPage } from './remb';


@NgModule({
  declarations: [
    RembPage,
  ],
  imports: [
    IonicPageModule.forChild(RembPage),
    PipesModule
  ],
})
export class RembPageModule { }
