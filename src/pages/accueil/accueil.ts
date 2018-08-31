import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, Platform } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public dataProvider: DataProvider, public platForm: Platform, private modalCtrl: ModalController) {
    this.plateforme = UserData.getInstance().plateforme;
    this.menus = UserData.getInstance().menus;
    this.menusStats = UserData.getInstance().menusStats;
    this.isEnabled = this.isLarge();
    this.platForm.resize.subscribe(() => {
      this.isEnabled = this.isLarge();
    });
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
    if (true == true) return true;
    if (this.dataProvider.isLogged) return true;
    return this.navCtrl.setRoot('LoginPage').then(() => {
      return false;
    }).catch(() => {
      return false;
    });
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

}
