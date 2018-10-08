import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: any[];
  constructor(public modalCtrl: ModalController, private dataProvider: DataProvider, private alertCtrl: AlertController, private toastCtrl: ToastController, private navCtrl: NavController) {
  }
  ionViewCanEnter() {
    //if (true == true) return true;
    if (this.dataProvider.isLogged) return true;
    setTimeout(() => {
      this.navCtrl.setRoot('LoginPage');
    }, 0);
    return Promise.reject(true);
  }
  ngAfterViewInit() {
    /* this.dataProvider.getUsers().subscribe((users) => {
      this.users = users;
    }, (err) => {
      this.users = [];
    }) */
  }
  editUser(user?: any) {
    let modal = this.modalCtrl.create('SignUpPage', { user }, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result) => {
      /* if (result) {
        if (user && user._id) {
          this.users = this.users.map((clas) => {
            if (clas._id == user._id)
              return result;
            return clas;
          });
        } else
          this.users.unshift(result);
      } */
    });
    modal.present();
  }

}
