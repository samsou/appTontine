import { DataProvider } from './../../providers/data/data';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private dataProvider: DataProvider) {

  }
  ionViewDidEnter() {
    setTimeout(() => {
      if (!this.dataProvider.isLogged)
      this.navCtrl.setRoot('LoginPage');
      else
        this.navCtrl.setRoot('AccueilPage');
    }, 3000);
  }

}
