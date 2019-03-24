import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Settings } from '../../providers/data/model';

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
  settings: Settings = {
    nbreJrAvance: 15,
    fraisTenueDeCompte: "200",
    fraisOuvertureDeCompte: "10000",
    codeSecretInstitution: "BJ",
    numOrdreClient: "1"
  };
  isSaving: boolean = false;
  constructor(public dataProvider: DataProvider, public viewCtrl: ViewController) {
    this.settings = dataProvider.userData.settings || this.settings;
    this.settings = Object.assign({}, this.settings);
  }

  close() {
    this.viewCtrl.dismiss();
  }
  save(invalid) {
    if (invalid) {
      alert("Le formulaire est incorrect");
      return;
    }
    this.isSaving = true;
    this.dataProvider.updateSettings(this.settings).then(() => {
      this.isSaving = false;
      this.close();
    }).catch(() => {
      this.isSaving = false;
      alert('Les Paramètres ne sont pas mise à jour,problème de réseau !!!');
    });
  }

}
