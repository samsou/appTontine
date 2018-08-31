import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
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
  isSaving: boolean = false;
  constructor(public navCtrl: NavController, private navParams: NavParams, private viewctrl: ViewController, private dataProvider: DataProvider, private toastCtrl: ToastController) {
    this.client = this.navParams.get('client') || {};
    this.client = Object.assign({}, this.client);
  }
  save() {
    this.isSaving = true;
    this.dataProvider.addClient(this.client).then((client) => {
      this.isSaving = false;
      this.close(this.client);
    }).catch((err) => {
      this.isSaving = false;
      let message = `Une erreur s'est produite lors de la création du client ${this.client.name} ${this.client.firstName}`;
      if (this.client.id) {
        message = `Une erreur s'est produite lors de la modification du client ${this.client.name} ${this.client.firstName}`;
      }
      let toast = this.toastCtrl.create({
        message: message, duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }
  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
