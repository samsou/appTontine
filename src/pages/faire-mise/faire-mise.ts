import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Compte } from '../../providers/data/model';
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
  compte: Compte = {};
  mise: Mise = {};
  mises: any[] = [];
  nbreMise = new Set();
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    if (!navParams.get('compte')) {
      this.close();
    } else {
      this.compte = navParams.get('compte');
      this.compte.montantSouscritTontine = 1000;
      this.compte.dateCompte = Date.now();
      this.compte.miseTontine = 30;
      for (let index = 1; index <= 31; index++) {
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
    this.mise.idClient = this.compte.idClient;
    this.mise.idCompte = this.compte.id;
    this.mise.date = Date.now();
    //this.mise.mise
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
