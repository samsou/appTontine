import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientSearchPage } from './client-search';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ClientSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientSearchPage),
    PipesModule
  ]
})
export class ClientSearchPageModule {}
