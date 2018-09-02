import { Component, Input } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';

import { DataProvider } from './../../providers/data/data';
import { Client, Compte, Produit } from './../../providers/data/model';

/**
 * Generated class for the CreateTontineComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-tontine',
  templateUrl: 'create-tontine.html'
})
export class CreateTontineComponent {
  isSaving: boolean = false;
  @Input('compte') tontine: Compte = {
    typeCompte: 'TONTINE'
  };
  client: Client = {};
  produit: Produit = {};

  constructor(public dataProvider: DataProvider, private toastCtrl: ToastController, private viewCtrl: ViewController) {
  }

  getSelected(clt: Client): any {
    this.client = clt;
    return clt.id;
  }
  getSelectedProduit(produit: Produit): any {
    this.produit = produit;
    return produit.id;
  }
  save() {
    this.isSaving = true;
    if (!this.tontine.id) {
      this.tontine.typeCompte = 'TONTINE';
      this.tontine.miseTontine = 0;
      this.tontine.dateCompte = Date.now();
    } else {
      this.client = this.tontine.client;
      this.produit = this.tontine.produit;
    }
    this.dataProvider.addCompte(this.tontine).then(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Le compte tontine du client ${this.client.name} a été ${!this.tontine.id ? 'crée' : 'modifié'}`,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
      this.tontine.idClient = null;
      this.tontine.montantSouscritTontine = null;
      this.client = null;
      if (this.tontine.id) this.viewCtrl.dismiss();
    }).catch(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Une erreur s'est produite lors de la ${!this.tontine.id ? 'création' : 'modification'} d'un compte tontine du client ${this.client.name}`,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

}
