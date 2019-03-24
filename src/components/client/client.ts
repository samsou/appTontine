import { Component } from '@angular/core';
import { AlertController, ModalController, PopoverController, ToastController, ViewController, NavParams,LoadingController, } from 'ionic-angular';

import { Client } from '../../providers/data/model';
import { Settings } from '../../providers/data/model';
import { DataProvider } from './../../providers/data/data';


@Component({
  selector: 'client',
  templateUrl: 'client.html'
})
export class ClientComponent {
  clients: Client[]=[];
  setting : Settings;
  constructor(public dataProvider: DataProvider, private modalCtrl: ModalController, private toastCtrl: ToastController, private popoverCtrl: PopoverController, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
  }
  ngAfterViewInit() {
    //this.getClients();
    this.getSetting();
  }

  ngOnInit(){
    this.getClients();
  }

  getClients() {
    this.dataProvider.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    }, (err) => {
    });
  }
  getSetting() {
    this.dataProvider.getSettings().subscribe((sett: Settings) => {
      this.setting = sett;
    }, (err) => {
    });
  }
  showComptes(client: Client) {
    let modal = this.modalCtrl.create('CompteClientPage', { client }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }

  majClients(){
    console.log(this.clients);
    this.clients.forEach(element => {
    element.isFraisOk=false;
    element.fraisOuverture=0;
    this.dataProvider.addClient(element).then((client) => {}).
    catch((err) => {});

    });
  }

  openOptions(myEvent, client: Client) {
    let popover = this.popoverCtrl.create(ClientOptions, { client });
    popover.onDidDismiss((result) => {
      if (result == 'COMPTES') {
        this.showComptes(client);
      } else if (result == 'PAYER') {
        let alert = this.alertCtrl.create({
          title: "Paiement des Frais d'ouverture de compte",
          message: ` pour le client ${client.name} ${client.firstName}`,
          inputs:[
           {
             name:"montant",
             value: this.setting.fraisOuvertureDeCompte
           }
          ],
          buttons: ['Annuler', {
            text: 'OK',
            handler: (data) => {
              if (!data.montant) {
                  window.alert('Saisissez un montant !!!');
                  return;
              }
              if (!/^[0-9]+$/.test(data.montant)) {
                  window.alert('Saisissez un montant valide !!!');
                  return;
              }
              let loading = this.loadingCtrl.create({
                content: "paiement des frais d'ouverture de compte ...",
                enableBackdropDismiss: false
              });
              loading.present();
              this.dataProvider.payerFraisOuverture(client,data.montant).then(() => {

                let recette = {
                  idClient: client.id,
                  montant: data.montant,
                  motif: "Recettes des frais d'ouverture de compte"
                }
                this.dataProvider.deduireRecette(recette).then(() => {})
                .catch(() => {
                    loading.dismiss();
                    alert = this.alertCtrl.create({
                    buttons: ['OK']
                    });
                    alert.setMessage("Une erreur s'est produite lors de l'enregistrement des frais d'ouverture de compte, veuillez réessayer!!!");
                    alert.present();
                });
                loading.dismiss();
                alert = this.alertCtrl.create({
                  buttons: ['OK']
                });
                alert.setMessage("Les frais d'ouverture ont été payés avec succès");
                alert.present();
              }).catch(() => {
                loading.dismiss();
                alert = this.alertCtrl.create({
                  buttons: ['OK']
                });
                alert.setMessage("Une erreur s'est produite lors de l'enregistrement des frais d'ouverture de compte, veuillez réessayer!!!");
                alert.present();
              });
            }
          }]
        });
        alert.present();
      }  else if (result == 'STATS') { }

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
            }).catch((e) => {
              let msg = `Le client ${client.name} ${client.firstName} n'a pas été supprimé`;
              if (e === 'cannotDeleteAccount') {
                msg = "Ce client ne peut être supprimer,les soldes de ses comptes ne sont pas à zéro";
              }
              let toast = this.toastCtrl.create({
                message: msg,
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
      <button no-padding no-margin ion-item *ngIf="!isFraisPaye" (click)="close('PAYER')"> Payer Frais Ouvrture </button>
      <button no-padding no-margin ion-item (click)="close('COMPTES')"> Voir ses comptes</button>
    </ion-list>
  `
})
/* <button ion-item (click)="close('STATS')">Ses statistiques</button>   */
export class ClientOptions {
  client: Client;
  isFraisPaye:boolean=false;
  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.client = this.navParams.get('client');
    this.isFraisPaye = this.canDemanderCredit();
   }

   canDemanderCredit(): boolean {
    if (!this.client) return false;
    return this.client.fraisOuverture > 0
  }

  close(result?) {
    this.viewCtrl.dismiss(result);
  }
}
