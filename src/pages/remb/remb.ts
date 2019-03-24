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
  echeancesAuDepart: Echeance[] = [];
  echeancesPayees: Echeance[] = [];
  montantTotalTontine = 0;
  montantTotalEpargne = 0;
  isSaving: boolean;
  nbreEcheance = new Set();
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewctrl: ViewController, private dataProvider: DataProvider) {
    //this.client = this.navParams.get('client') || {};
    this.compte = navParams.get('compte');

  }

  ionViewDidLoad() {
    this.echeances=[];
    this.echeancesPayees=[];
    this.getEcheances(this.compte);
    this.getEcheancesPayees(this.compte);
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
      if (echeance.checked)
        this.nbreEcheance.add(echeance.index);
        else
        this.nbreEcheance.delete(echeance.index);
    }
  }


  save(){
    let n1:number=0;
    let n2:number=0;
    let mtEch:number=0;
    this.echeances.forEach(element => {
        if(element.payer==true) n1=n1+1;
        mtEch=element.nominal+element.interet;
    });
    this.echeancesPayees.forEach(element => {
      if(element.payer==true) n2=n2+1;
    });
    // console.log(n1);
    // console.log(n2);


    //console.log(this.size);
    let data:any={};
    data.montant=(n1-n2)*(mtEch);
    data.nameDeposant=this.compte.client.name+ ' '+ this.compte.client.firstName;
    data.phoneDeposant=this.compte.client.telephone;
    data.phoneDeposant=this.compte.client.telephone;
    data.numCarteDeposant=this.client.numCarte;
    this.echeances.forEach(element => {
      this.dataProvider.addEcheance(element).then(() => {}).catch(()=> {});
    });
    this.navCtrl.push(
      'RelevePage', {
        action: 'QUITTANCE',
        model: {
          ...this.compte,
          ...data,
          type: 'DEPOT'
        }
      }
    );
  }

  getEcheances(compte) {
    this.dataProvider.getEcheances(compte).subscribe((echeances) => {
      this.echeances = echeances;
      this.echeancesAuDepart=echeances;
      //this.montantTotalTontine += (+this.compte.montantSouscritTontine || 0) * (+this.compte.miseTontine || 0);
    }, () => { });
  }

  getEcheancesPayees(compte) {
    this.dataProvider.getEcheancesPayees(compte).subscribe((echeances) => {
      this.echeancesPayees = echeances;
      //this.montantTotalTontine += (+this.compte.montantSouscritTontine || 0) * (+this.compte.miseTontine || 0);
    }, () => { });
  }

  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
