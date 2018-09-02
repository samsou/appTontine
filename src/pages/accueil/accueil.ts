import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Platform, PopoverController, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { UserData } from './../../providers/data/userdata';

/**
 * Generated class for the AccueilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html',
})
export class AccueilPage {
  isEnabled: boolean = false;
  isOpen: boolean = true;
  menus: any[] = [];
  menusStats: any[] = [];
  plateforme: string;
  onLine: boolean = false;
  constructor(public navCtrl: NavController, public dataProvider: DataProvider, public platForm: Platform, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
    this.plateforme = UserData.getInstance().plateforme;
    this.menus = UserData.getInstance().menus;
    this.menusStats = UserData.getInstance().menusStats;
    this.isEnabled = this.isLarge();
    window.onresize = () => {
      this.isEnabled = this.isLarge();
    };
    window.ononline = () => {
      this.onLine = navigator.onLine;
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  toBread(bread) {
    this.dataProvider.userData.currentSearch = '';
    this.dataProvider.userData.code = bread.code;
  }
  toLink(menu) {
    this.dataProvider.userData.currentSearch = '';
    this.dataProvider.userData.currentMenu = menu;
    this.dataProvider.userData.code = UserData.getInstance().currentMenu.code
  }
  toBoard() {
    this.dataProvider.userData.currentSearch = '';
    this.dataProvider.userData.code = '';
    this.dataProvider.userData.currentMenu = null;
  }

  ionViewCanEnter() {
    //if (true == true) return true;
    if (this.dataProvider.isLogged) return true;
    setTimeout(() => {
      this.navCtrl.setRoot('LoginPage');
    }, 0);
    return Promise.reject(true);
  }
  isLarge() {
    return (this.platForm.is('core') || this.platForm.is('windows')) && this.platForm.width() >= 650;
  }
  openSettings() {
    let modal = this.modalCtrl.create('SettingsPage', null, {
      enableBackdropDismiss: false
    });
    modal.present();
  }
  presentAccount(ev) {
    let popover = this.popoverCtrl.create(AccountOptions);
    popover.onDidDismiss((result) => {
      if (result == "LOGOUT") {
        this.dataProvider.logout().then(() => {
          this.navCtrl.setRoot('LoginPage');
        });
      } else if (result == "LOGIN") {
        this.navCtrl.setRoot('LoginPage');
      }
    });
    popover.present({
      ev: ev
    });
  }

}

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close()" *ngIf="dataProvider.isLogged" disabled>{{dataProvider.user?.name || 'user name'}}</button>
      <button ion-item (click)="close('LOGOUT')" *ngIf="dataProvider.isLogged">Se déconnecter</button>
      <button ion-item (click)="close('LOGIN')" *ngIf="!dataProvider.isLogged">Se connecter</button>
    </ion-list>
  `
})
export class AccountOptions {
  constructor(public viewCtrl: ViewController, public dataProvider: DataProvider) {
  }
  close(result?: any) {
    this.viewCtrl.dismiss(result);
  }
}
