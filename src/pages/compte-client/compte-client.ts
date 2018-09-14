import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Client, Compte } from '../../providers/data/model';


/**
 * Generated class for the CompteClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-compte-client',
  templateUrl: 'compte-client.html',
})
export class CompteClientPage {
  typeCompte: string = 'tontine';
  client: Client = {};
  comptes: Compte[] = [];
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewctrl: ViewController, private dataProvider: DataProvider) {
    this.client = this.navParams.get('client') || {};
  }
  ionViewDidLoad() {
    this.comptes = this.dataProvider.getClientAccounts(this.client.id);
  }
  onChanged(ev) { }
  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
