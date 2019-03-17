import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Compte, Mise } from '../../providers/data/model';

/**
 * Generated class for the MisesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mises',
  templateUrl: 'mises.html',
})
export class MisesPage {
  compte: Compte;
  mises: Mise[] = [];
  montantTotalTontine: number = 0;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataProvider: DataProvider) {
    this.compte = navParams.get('compte');
    this.getMises(this.compte);
  }
  getMises(compte) {
    this.dataProvider.getMises(compte).subscribe((mises) => {
      this.mises = mises;
      this.montantTotalTontine += (+this.compte.montantSouscritTontine || 0) * (+this.compte.miseTontine || 0);
    }, () => { });
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
