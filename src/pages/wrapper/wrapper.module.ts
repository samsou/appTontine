import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../components/components.module';
import { WrapperPage } from './wrapper';

@NgModule({
  declarations: [
    WrapperPage,
  ],
  imports: [
    IonicPageModule.forChild(WrapperPage),
    ComponentsModule
  ],
})
export class WrapperPageModule { }
