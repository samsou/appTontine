import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the OptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  type: string;
  options: any[] = [];
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.type = this.navParams.get('type');
    this._buildOptions();
  }
  private _buildOptions() {
    if (this.type == 'User') {
      this.options = [
        {
          libelle: 'Changer le mot de passe',
          code: 'CHANGE_PASS'
        }
      ];
    }
  }
  onTap(item) {
    if (this.type === 'Counting') this.close(item);
    else this.close(item.code);
  }
  close(result?: any) {
    this.viewCtrl.dismiss(result);
  }
}
