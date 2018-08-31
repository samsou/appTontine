import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Client } from '../../providers/data/model';

/**
 * Generated class for the AddClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-client',
  templateUrl: 'add-client.html',
})
export class AddClientPage {
  client: Client = {};
  constructor(public navCtrl: NavController, private navParams: NavParams, private viewctrl: ViewController) {
    this.client = this.navParams.get('client') || {};
  }
  save() {
    this.close(this.client);
  }
  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
