import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PipesModule } from '../../pipes/pipes.module';
import { CompteClientPage } from './compte-client';

@NgModule({
  declarations: [
    CompteClientPage,
  ],
  imports: [
    IonicPageModule.forChild(CompteClientPage),
    PipesModule
  ],
})
export class CompteClientPageModule { }
