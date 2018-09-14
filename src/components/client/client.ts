import { Component } from '@angular/core';
import { AlertController, ModalController, PopoverController, ToastController, ViewController } from 'ionic-angular';

import { Client } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';

/**
 * Generated class for the ClientComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'client',
  templateUrl: 'client.html'
})
export class ClientComponent {
  clients: Client[];
  constructor(private dataProvider: DataProvider, private modalCtrl: ModalController, private toastCtrl: ToastController, private popoverCtrl: PopoverController, private alertCtrl: AlertController) {
  }
  ngAfterViewInit() {
    this.getClients();
  }
  getClients() {
    this.dataProvider.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    }, (err) => {
      console.log(err);
    });
  }
  showComptes(client: Client) {
    let modal = this.modalCtrl.create('CompteClientPage', { client }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }
  openOptions(myEvent, client: Client) {
    let popover = this.popoverCtrl.create(ClientOptions);
    popover.onDidDismiss((result) => {
      if (result == 'COMPTES') {
        this.showComptes(client);
      } else if (result == 'STATS') { }

    });
    popover.present({
      ev: myEvent
    });
  }
  delete(client: Client) {
    let alert = this.alertCtrl.create({
      title: "Suppression d'un client",
      message: `Voulez-vous supprimer le client ${client.name} ${client.firstName}?`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.dataProvider.removeClient(client).then(() => {
              let toast = this.toastCtrl.create({
                message: `Le client ${client.name} ${client.firstName} a été supprimé`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }).catch(() => {
              let toast = this.toastCtrl.create({
                message: `Le client ${client.name} ${client.firstName} n'a pas été supprimé`,
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
  edit(client: Client) {
    let modal = this.modalCtrl.create('AddClientPage', { client }, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result: Client | any) => {
      if (result == null) return;
      let toast = this.toastCtrl.create({
        message: `Le client ${result.name} ${result.firstName} a été modifié`,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
    modal.present();
  }
  addClient() {
    let modal = this.modalCtrl.create('AddClientPage', null, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result: Client | any) => {
      if (result == null) return;
      let toast = this.toastCtrl.create({
        message: `Le client ${result.name} ${result.firstName} a été crée`,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
    modal.present();
  }

}
@Component({
  template: `
    <ion-list no-padding no-margin>
      <button no-padding no-margin ion-item (click)="close('COMPTES')">Voir ses comptes</button>
    </ion-list>
  `
})
/* <button ion-item (click)="close('STATS')">Ses statistiques</button>   */
export class ClientOptions {
  constructor(public viewCtrl: ViewController) { }

  close(result?) {
    this.viewCtrl.dismiss(result);
  }
}
