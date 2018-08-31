import { Component } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { UserData } from '../providers/data/userdata';

@Component({
  templateUrl: 'app.html',
  styles: [`
    .accordion-head .label-md,
    .accordion-head ion-label.label.label-md {
        margin: 0 !important;
    }
  `]
})
export class MyApp {
  rootPage: any = HomePage;
  menus: any[] = [];
  menusStats: any[] = [];
  plateforme: string;
  constructor(platform: Platform, private modalCtrl: ModalController) {
    this.menus = UserData.getInstance().menus;
    this.menusStats = UserData.getInstance().menusStats;
    this.plateforme = UserData.getInstance().plateforme;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }
  get userData() {
    return UserData.getInstance();
  }
  toBread(bread) {
    UserData.getInstance().currentSearch = '';
    UserData.getInstance().code = bread.code;
  }
  toLink(menu) {
    if (menu.breadcrumbs && menu.breadcrumbs.length) return;
    UserData.getInstance().currentSearch = '';
    UserData.getInstance().currentMenu = menu;
    UserData.getInstance().code = UserData.getInstance().currentMenu.code
  }
  toBoard() {
    UserData.getInstance().currentSearch = '';
    UserData.getInstance().code = '';
    UserData.getInstance().currentMenu = null;
  }
  openSettings() {
    let modal = this.modalCtrl.create('SettingsPage');
    modal.present();
  }
}

