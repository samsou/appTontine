import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';

import { Produit } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';

/**
 * Generated class for the CreateProduitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-produit',
  templateUrl: 'create-produit.html',
})
export class CreateProduitPage {
  produit: Produit = {};
  isSaving: boolean = false;
  constructor(private viewCtrl: ViewController, public navParams: NavParams, private dataProvider: DataProvider, private toastCtrl: ToastController) {
    this.produit = navParams.get('produit') || {};
    this.produit = Object.assign({}, this.produit);
  }
  save() {
    this.isSaving = true;
    if (this.produit.typeProduit == 'TONTINE') {
      this.produit.nbreEcheance = this.produit.nbreMiseTotal - this.produit.nbreMisePrelever;
    } else {
      this.produit.nbreEcheance = null;
      this.produit.montantMax = null;
      this.produit.montantMin = null;
      this.produit.nbreMiseAvance = null;
      this.produit.nbreMisePrelever = null;
      this.produit.nbreMiseTotal = null;
    }
    this.dataProvider.addProduit(this.produit).then((client) => {
      this.isSaving = false;
      this.close(this.produit);
    }).catch((err) => {
      this.isSaving = false;
      let message = `Une erreur s'est produite lors de la création du produit ${this.produit.libelle}`;
      if (this.produit.id) {
        message = `Une erreur s'est produite lors de la modification du client ${this.produit.libelle}`;
      }
      let toast = this.toastCtrl.create({
        message: message, duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

  close(result?: Produit) {
    this.viewCtrl.dismiss(result);
  }

}
