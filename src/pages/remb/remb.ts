import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Client, Compte, Echeance } from '../../providers/data/model';


/**
 * Generated class for the CompteClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-remb',
  templateUrl: 'remb.html',
})
export class RembPage {
  typeCompte: string = 'tontine';
  client: Client = {};
  compte: Compte;
  comptes: Compte[] = [];
  echeances: Echeance[] = [];
  montantTotalTontine = 0;
  montantTotalEpargne = 0;
  isSaving: boolean;
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewctrl: ViewController, private dataProvider: DataProvider) {
    //this.client = this.navParams.get('client') || {};
    this.compte = navParams.get('compte');

  }

  ionViewDidLoad() {
    this.echeances=[];
    this.getEcheances(this.compte);
    console.log(this.echeances);

    this.comptes = this.dataProvider.getClientAccounts(this.client.id);
    this.comptes.forEach((cpte) => {
      if (cpte.typeCompte === "TONTINE")
        this.montantTotalTontine += (+cpte.montantSouscritTontine || 0) * (+cpte.miseTontine || 0);
      if (cpte.typeCompte === "EPARGNE")
        this.montantTotalEpargne += +cpte.montant || 0;
    });
  }
  onChange(echeance) {
    if (!echeance.disabled) {
      if (echeance.checked){
        console.log('oui');
      }
    }
  }

  save(){
    this.echeances.forEach(element => {
      this.dataProvider.addEcheance(element).then(() => {}).catch(()=> {});
    });
  }

  getEcheances(compte) {
    this.dataProvider.getEcheances(compte).subscribe((echeances) => {
      this.echeances = echeances;
      //this.montantTotalTontine += (+this.compte.montantSouscritTontine || 0) * (+this.compte.miseTontine || 0);
    }, () => { });
  }

  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
