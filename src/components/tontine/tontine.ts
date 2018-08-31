import { Component } from '@angular/core';
import {
  AlertController,
  ModalController,
  NavParams,
  PopoverController,
  ToastController,
  ViewController,
} from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Compte } from '../../providers/data/model';

/**
 * Generated class for the TontineComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tontine',
  templateUrl: 'tontine.html'
})
export class TontineComponent {
  tontines: Compte[] = [];

  constructor(private popoverCtrl: PopoverController, public dataProvider: DataProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }
  ngAfterViewInit() {
    this.getComptes();
  }
  getComptes() {
    this.dataProvider.getComptes('TONTINE').subscribe((comptes: Compte[]) => {
      this.tontines = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        return compte;
      });
    }, (err) => {
      console.log(err);
    });
  }
  openOptions(myEvent, compte: Compte) {
    let popover = this.popoverCtrl.create(TontineOptions, { compte });
    popover.onDidDismiss((result) => {
      if (result == 'MISE') {
        let modal = this.modalCtrl.create('FaireMisePage', { compte }, {
          enableBackdropDismiss: false
        });
        //modal.
        modal.present();
      }
      else if (result == 'RETRAIT') {

      }
      else if (result == 'AVANCE') {

      }
      else if (result == 'MISES') { }
    });
    popover.present({
      ev: myEvent
    });
  }
  edit(compte: Compte) {
    let modal = this.modalCtrl.create('WrapperPage', { compte, type: 'CreateTontineComponent' }, {
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
      title: "Suppression d'un compte tontine",
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
      <button ion-item (click)="close('MISE')" *ngIf="isNotFull">Faire une mise</button>
      <button ion-item (click)="close('RETRAIT')" *ngIf="compte.miseTontine >= 2 || isRetrait">Retirer le montant</button>
      <button ion-item (click)="close('AVANCE')" *ngIf="!compte.avanceTontine && compte.typeCompte == 'TONTINE' &&  isAvance && !compte.dateCloture">Faire une avance</button>
      <button ion-item (click)="close('MISES')" *ngIf="compte && compte.miseTontine">Voir les mises</button>
    </ion-list>
  `
})
export class TontineOptions {
  compte: Compte;
  isAvance: boolean = false;
  isRetrait: boolean = false;
  isNotFull: boolean = false;
  constructor(public viewCtrl: ViewController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.compte = this.navParams.get('compte');
    this.isAvance = this.canAvance();
    this.isRetrait = this.canRetrait();
    this.isNotFull = this.isNotCloture();
  }
  canRetrait(): boolean {
    if (!this.compte || !this.isAvance) return false;
    return 31 <= this.compte.miseTontine;
  }
  isNotCloture(): boolean {
    if (!this.compte) return false;
    return !this.compte.miseTontine || this.compte.miseTontine < 31;
  }
  canAvance(): boolean {
    if (!this.compte) return false;
    return this.dataProvider.userData.settings.nbreJrAvance <= this.compte.miseTontine;
  }
  close(result?: any) {
    this.viewCtrl.dismiss(result);
  }
}
