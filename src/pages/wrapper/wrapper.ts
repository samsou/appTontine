import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WrapperPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wrapper',
  templateUrl: 'wrapper.html',
})
export class WrapperPage {
  type: string;
  compte: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.type = navParams.get('type');
    this.compte = navParams.get('compte');
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
