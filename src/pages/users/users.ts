import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  ModalController,
  NavController,
  PopoverController,
  ToastController,
} from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  users: any[];
  constructor(public modalCtrl: ModalController, private dataProvider: DataProvider, private alertCtrl: AlertController, private toastCtrl: ToastController, private navCtrl: NavController, private popoverCtrl: PopoverController) {
  }
  ionViewCanEnter() {
    //if (true == true) return true;
    if (this.dataProvider.isLogged) return true;
    setTimeout(() => {
      this.navCtrl.setRoot('LoginPage');
    }, 0);
    return Promise.reject(true);
  }
  ngAfterViewInit() {
    this.dataProvider.getUsers().subscribe((users) => {
      console.log(users);
      this.users = users;
    }, (err) => {
      this.users = [];
    })
  }
  editUser(user?: any) {
    let modal = this.modalCtrl.create('SignUpPage', { user }, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result) => {
      /* if (result) {
        if (user && user._id) {
          this.users = this.users.map((clas) => {
            if (clas._id == user._id)
              return result;
            return clas;
          });
        } else
          this.users.unshift(result);
      } */
    });
    modal.present();
  }
  deleteUser(user: any) {
    let isDeleting: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Suppression d'un utilisateur",
      message: `Voulez-vous supprimer l'utilisateur ${user.name}?`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            if (isDeleting) return false;
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            if (isDeleting) return false;
            isDeleting = true;
            alert.setTitle('Suppression en cours');
            alert.setMessage('veuillez patienter ...');
            this.dataProvider.deleteUser(user).then(() => {
              isDeleting = false;
              alert.dismiss();
              let toast = this.toastCtrl.create({
                message: `L'utilisateur ${user.name} a été supprimé`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }, () => {
              isDeleting = false;
              alert.dismiss();
              let toast = this.toastCtrl.create({
                message: `L'utilisateur ${user.name} n'a pas été supprimé`,
                duration: 2000,
                position: 'bottom',
                cssClass: 'toast-error'
              });
              toast.present();
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }
  openOptions(myEvent, user: any) {
    let popover = this.popoverCtrl.create('OptionsPage', { type: 'User', user });
    popover.onDidDismiss((result) => {
      if (result === 'CHANGE_PASS') {
        this.changePassword(user);
      }
    });
    popover.present({
      ev: myEvent
    });
  }
  changePassword(user) {
    let isDeleting: boolean = false;
    let alert = this.alertCtrl.create({
      title: "Modification de mot de passe d'un utilisateur",
      message: `Voulez-vous modifier le mot de passe de  l'utilisateur ${user.name}?`,
      enableBackdropDismiss: false,
      inputs: [
        {
          placeholder: "Nouveau mot de passe",
          name: "pass",
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            if (isDeleting) return false;
          }
        },
        {
          text: 'Modifier',
          handler: (data) => {
            if (!data.pass) return false;
            if (isDeleting) return false;
            isDeleting = true;
            alert.setTitle('Modification de mot de passe en cours');
            alert.setMessage('veuillez patienter ...');
            this.dataProvider.changePassword({
              username: user.username,
              password: data.pass
            }).then(() => {
              isDeleting = false;
              alert.dismiss();
              let toast = this.toastCtrl.create({
                message: `Le mot de passe de ${user.name} a été changé`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }).catch(() => {
              isDeleting = false;
              alert.dismiss();
              let toast = this.toastCtrl.create({
                message: `Le changement du mot de passe de ${user.name} a échoué`,
                duration: 2000,
                position: 'bottom',
                cssClass: 'toast-error'
              });
              toast.present();
            });
            return false;
          }
        }
      ]
    });
    alert.present();
  }
}
