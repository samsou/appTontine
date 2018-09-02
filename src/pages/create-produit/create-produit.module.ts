import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateProduitPage } from './create-produit';

@NgModule({
  declarations: [
    CreateProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateProduitPage),
  ],
})
export class CreateProduitPageModule {}
