import { Component, Input } from '@angular/core';
import { ToastController, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Client, Compte } from '../../providers/data/model';

/**
 * Generated class for the CreateEpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-epargne',
  templateUrl: 'create-epargne.html'
})
export class CreateEpargneComponent {

  @Input('compte') epargne: Compte = {
    typeCompte: 'EPARGNE'
  };

  client: Client = {};
  isSaving: boolean = false;

  constructor(public dataProvider: DataProvider, private toastCtrl: ToastController, private viewCtrl: ViewController) {
  }

  getSelected(clt: Client): any {
    this.client = clt;
    return clt.id;
  }
  save() {
    this.isSaving = true;
    if (!this.epargne.id) {
      this.epargne.typeCompte = 'EPARGNE';
      this.epargne.dateCompte = Date.now();
    } else
      this.client = this.epargne.client;
    this.dataProvider.addCompte(this.epargne).then(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Le compte epargne du client ${this.client.name} a été ${!this.epargne.id ? 'crée' : 'modifié'}`,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
      this.epargne.idClient = null;
      this.epargne.montantSouscritTontine = null;
      this.client = null;
      if (this.epargne.id) this.viewCtrl.dismiss();
    }).catch(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Une erreur s'est produite lors de la ${!this.epargne.id ? 'création' : 'modification'} d'un compte epargne du client ${this.client.name}`,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
    });
  }

}
