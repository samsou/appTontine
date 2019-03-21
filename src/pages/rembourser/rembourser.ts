import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Compte, Echeance, Mise } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';
@IonicPage()
@Component({
  selector: 'page-rembourser',
  templateUrl: 'rembourser.html',
})
export class RembourserPage {
  compte: Compte = {
    typeCompte: ''
  };
  echeance: Echeance = {};
  echeances: any[] = [];
  mise: Mise = {};
  mises: any[] = [];
  nbreMise = new Set();
  isSaving: boolean;
  constructor(public dataProvider: DataProvider, public navParams: NavParams, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    if (!navParams.get('compte')) {
      this.close();
    } else {
      this.compte = navParams.get('compte');
      this.echeances.push(this._getEcheances(this.compte));
    };
  };

  ngOnInit() {
    console.log(this.echeances);
  }
  _getEcheances(compte:Compte) {
    this.dataProvider.getEcheances(compte).subscribe((echeances: Echeance[]) => {
      this.echeances = echeances;

    }, (err) => {
    });
  }


  onChange(echeance) {
    if (!echeance.disabled) {
      if (echeance.checked)
        this.nbreMise.add(echeance.index);
      else
        this.nbreMise.delete(echeance.index);
    }
  }

  save() {
    this.isSaving = true;
    //this.echeance.idClient = this.compte.idClient;
    this.echeance.idCompte = this.compte.id;
    //this.echeance.mise = this.nbreMise.size || 1;
   // this.mise.date = this.dataProvider.user.clotureDate || Date.now();
    this.dataProvider.addEcheance(this.compte).then((client) => {
      let recette: any = true;
      if (!this.compte.miseTontine || this.compte.miseTontine == 0) {
        recette = {
          // idClient: this.mise.idClient,
          // idCompte: this.mise.idCompte,
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
        this.close(this.echeance);
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
