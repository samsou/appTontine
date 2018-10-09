import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';

import { DataProvider } from './../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public model: any = {
    username: '',
    password: ''
  };
  public backgroundImage = 'assets/imgs/background-5.jpg';
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private dataProvider: DataProvider) {
  }
  onkeyup(ev: any) {
    if (this.model.password && this.model.username && ev.keyCode == 13) this.login();
  }
  login() {
    if (!this.model.password || !this.model.username) return;
    const loading = this.loadingCtrl.create({
      content: "Connexion ..."
    });
    this.dataProvider.login(this.model).
      subscribe((result) => {
        loading.dismiss();
        if (result && result.password === this.model.password) {
          this.dataProvider.isLogged = true;
          this.dataProvider.authenticationState.next(true);
          this.dataProvider.user = result;
          this.navCtrl.setRoot("AccueilPage");
        } else {
          const alert = this.alertCtrl.create({
            title: "Erreur d'authentification",
            subTitle: "Nom d'utilisateur ou mot de passe erroné.",
            buttons: ['Ok']
          });
          alert.present();
        }
      }, (error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: "Erreur d'authentification",
          subTitle: "Nom d'utilisateur ou mot de passe erroné.",
          buttons: ['Ok']
        });
        alert.present();
      });

    loading.present();

  }
  goToSignup() { }
}