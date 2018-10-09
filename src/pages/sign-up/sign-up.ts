import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { DataProvider } from './../../providers/data/data';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  model: any = {
    name: '',
    firstName: '',
    phone: '',
    email: '',
    username: '',
    password: '',
    permissions: []
  };
  confirmPass: string = '';
  ressources: any[];
  isSaving: boolean = false;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, private dataProvider: DataProvider) {
    let user = this.navParams.get('user');
    if (user) this.model = Object.assign({}, user);
    this.ressources = this.dataProvider.ressources;
  }

  close(result?: any) {
    this.viewCtrl.dismiss(result);
  }
  save(invalid) {
    if (invalid) {
      alert("Le formulaire est incorrect");
      return;
    }
    this.isSaving = true;
    this.dataProvider.signUp(this.model).then((res) => {
      console.log(res);
      this.close(this.model);
    }).catch((err) => {
      console.log(err);
    })
  }

}
