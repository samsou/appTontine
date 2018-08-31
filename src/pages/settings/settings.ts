import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(public dataProvider: DataProvider, public viewCtrl: ViewController) {
  }

  close() {
    this.viewCtrl.dismiss();
  }
  save() {
    //this.dataProvider.saveSettings();
  }

}
