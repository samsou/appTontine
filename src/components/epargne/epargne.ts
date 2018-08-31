import { Component } from '@angular/core';
import { AlertController, ModalController, PopoverController, ToastController, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Compte } from '../../providers/data/model';

/**
 * Generated class for the EpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'epargne',
  templateUrl: 'epargne.html'
})
export class EpargneComponent {
  epargnes: Compte[] = [];

  constructor(private popoverCtrl: PopoverController, public dataProvider: DataProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }
  ngAfterViewInit() {
    this.getComptes();
  }
  getComptes() {
    this.dataProvider.getComptes('EPARGNE').subscribe((comptes: Compte[]) => {
      this.epargnes = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        return compte;
      });
      console.log(this.epargnes);
    }, (err) => {
      console.log(err);
    });
  }
  openOptions(myEvent, compte: Compte) {
    let popover = this.popoverCtrl.create(EpargneOptions);
    popover.onDidDismiss((result) => {
      if (result == 'DEPOT') { }
      else if (result == 'RETRAIT') { }
      else if (result == 'SOLDE') {
        let name: string = '';
        if (compte.client) {
          name = compte.client.name + ' ' + compte.client.firstName;
        }
        let alert = this.alertCtrl.create({
          title: "Consulter solde",
          message: `du compte epargne du client ${name}?`,
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Annuler'
            },
            {
              text: 'Consulter',
              handler: () => {
                let alert = this.alertCtrl.create({
                  message: `Le solde sur le compte epargne du client ${name} est ${compte.montant || '00'}`,
                  enableBackdropDismiss: false,
                  buttons: [
                    {
                      text: 'Ok',
                      handler: () => {

                      }
                    }
                  ]
                });
                alert.present();
              }
            }
          ]
        });
        alert.present();
      }
    });
    popover.present({
      ev: myEvent
    });
  }
  edit(compte: Compte) {
    let modal = this.modalCtrl.create('WrapperPage', { compte, type: 'CreateEpargneComponent' }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }
  delete(compte: Compte) {
    let name: string = '';
    if (compte.client) {
      name = compte.client.name + ' ' + compte.client.firstName;
    }
    let alert = this.alertCtrl.create({
      title: "Suppression d'un compte epargne",
      message: `Voulez-vous supprimer le compte du client ${name}?`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.dataProvider.removeCompte(compte).then(() => {
              let toast = this.toastCtrl.create({
                message: `Le compte tontine du client ${compte.client.name} ${compte.client.firstName} a été supprimé`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }).catch(() => {
              let toast = this.toastCtrl.create({
                message: `Le client ${compte.client.name} ${compte.client.firstName} n'a pas été modifié`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }
}

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="close('DEPOT')">Faire un depôt</button>
      <button ion-item (click)="close('RETRAIT')">Faire un retrait</button>
      <button ion-item (click)="close('SOLDE')">Consulter solde</button>
    </ion-list>
  `
})
export class EpargneOptions {
  constructor(public viewCtrl: ViewController) { }

  close(result?) {
    this.viewCtrl.dismiss(result);
  }
}
