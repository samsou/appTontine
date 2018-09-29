import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';

import { Compte } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';
import { Mise } from './../../providers/data/model';

/**
 * Generated class for the FaireMisePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faire-mise',
  templateUrl: 'faire-mise.html',
})
export class FaireMisePage {
  compte: Compte = {
    typeCompte: ''
  };
  mise: Mise = {};
  mises: any[] = [];
  nbreMise = new Set();
  isSaving: boolean;
  constructor(public dataProvider: DataProvider, public navParams: NavParams, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    if (!navParams.get('compte')) {
      this.close();
    } else {
      this.compte = navParams.get('compte');
      this.compte = Object.assign({}, this.compte);
      let len = 31;
      if (this.compte.produit && this.compte.produit.nbreMiseTotal) {
        len = this.compte.produit.nbreMiseTotal;
      }
      for (let index = 1; index <= len; index++) {
        this.mises.push({
          index: index,
          checked: this.compte.miseTontine >= index,
          disabled: this.compte.miseTontine >= index
        });
      }
    }
  }
  onChange(mise) {
    if (!mise.disabled) {
      if (mise.checked)
        this.nbreMise.add(mise.index);
      else
        this.nbreMise.delete(mise.index);
    }
  }
  save() {
    this.isSaving = true;
    this.mise.idClient = this.compte.idClient;
    this.mise.idCompte = this.compte.id;
    this.mise.mise = this.nbreMise.size || 1;
    this.mise.date = Date.now();
    this.dataProvider.addMise(this.mise).then((client) => {
      let recette: any = true;
      if (!this.compte.miseTontine || this.compte.miseTontine == 0) {
        recette = {
          idClient: this.mise.idClient,
          idCompte: this.mise.idCompte,
          montant: this.compte.montantSouscritTontine,
          motif: "Déduction automatique lors de la première mise"
        }
      }
      this.dataProvider.deduireRecette(recette).then((res) => {
        this.dataProvider.addCompte(Object.assign({}, this.compte, {
          recetteDeduit: true,
          miseTontine: (this.compte.miseTontine || 0) + this.nbreMise.size
        })).then((client) => { }).catch((e) => { });
        this.isSaving = false;
        this.close(this.mise);
      }).catch((err) => {
        this.isSaving = false;
        let message = `Une erreur s'est produite lors de la mise du client ${this.compte.client.name} ${this.compte.client.firstName}`;
        let toast = this.toastCtrl.create({
          message: message, duration: 2000,
          position: 'bottom'
        });
        toast.present();
      });
    }).catch((err) => {
      this.isSaving = false;
      let message = `Une erreur s'est produite lors de la mise du client ${this.compte.client.name} ${this.compte.client.firstName}`;
      let toast = this.toastCtrl.create({
        message: message, duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });

  }
  close(result?) {
    this.viewCtrl.dismiss(result);
  }

}
