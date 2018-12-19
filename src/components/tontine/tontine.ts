import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
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
  tontines: Compte[];
  cloturer: any;
  montantTotalTontine: number = 0;
  constructor(private popoverCtrl: PopoverController, public dataProvider: DataProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private navCtrl: NavController) {
  }
  ngAfterViewInit() {
    this.getComptes();
  }
  getComptes() {
    this.dataProvider.getComptes('TONTINE').subscribe((comptes: Compte[]) => {
      this.tontines = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        compte.produit = this.dataProvider.getProduitById(compte.idProduit);
        this.montantTotalTontine += (+compte.montantSouscritTontine || 0) * (+compte.miseTontine || 0);
        return compte;
      });
    }, (err) => {
    });
  }
  openOptions(myEvent, compte: Compte) {
    let popover = this.popoverCtrl.create(TontineOptions, { compte });
    popover.onDidDismiss((result) => {
      if (result === 'PRINTER') {
        this.navCtrl.push(
          'RelevePage', {
            action: 'RELEVE',
            model: {
              ...compte,
              type: 'TONTINE'
            }
          }
        );
      }
      else if (result == 'MISE') {
        let modal = this.modalCtrl.create('FaireMisePage', { compte }, {
          enableBackdropDismiss: false
        });
        //modal.
        modal.present();
      } else if (result === 'RETRAIT_SUR_MISE') {
        let nbPre = 0;
        if (compte.produit)
          nbPre = compte.produit.nbreMisePrelever || 0;
        let nbM: number = (compte.miseTontine || 0) - (compte.nbMiseRetirer || 0) - nbPre;
        if (!compte.miseTontine || 0 >= nbM) {
          window.alert("Impossible de retirer,pas de mises");
          return;
        }
        let name = '';
        if (compte.client) {
          name = `${compte.client.name} ${compte.client.firstName}`;
        }
        let montantARetirer = 0;
        let alert = this.alertCtrl.create({
          title: "Retrait sur les mises du compte tontine",
          subTitle: `du client ${name}`,
          message: `Le client veut retirer combien de mises sur les ${nbM} mises qui peuvent être retiré?`,
          inputs: [
            {
              placeholder: 'Le nombre de mise ici..',
              type: 'number',
              min: 1,
              max: nbM,
              name: 'nbMise'
            }
          ],
          buttons: [
            'Annuler',
            {
              text: 'OK',
              handler: (data) => {
                if (!/^[0-9]+$/.test(data.nbMise)) {
                  window.alert('Saisissez un nombre de mise valide !!!');
                  return;
                }
                let nb: number = parseInt(data.nbMise) || 0;
                if (!nb) {
                  window.alert('Aucun retrait ne sera effectué');
                  return;
                }
                if (1 > nb || nb > nbM) {
                  window.alert(`Le client ne peut pas retirer plus de ${nbM} mises`);
                  return;
                }
                compte.nbMiseRetirer = (compte.nbMiseRetirer || 0) + nb;
                montantARetirer = compte.montantSouscritTontine * nb;
                let loading = this.loadingCtrl.create({
                  content: `Retrait sur mise du compte, somme: ${montantARetirer} ...`,
                  enableBackdropDismiss: false
                });
                loading.present();
                this.dataProvider.addCompte(compte).then(() => {
                  loading.dismiss();
                  alert = this.alertCtrl.create({
                    buttons: ['OK']
                  });
                  alert.setMessage(`${nb} mises ont été retiré sur le compte du client ${name}`);
                  alert.present();
                }).catch(() => {
                  loading.dismiss();
                  alert = this.alertCtrl.create({
                    buttons: ['OK']
                  });
                  alert.setMessage("Une erreur s'est produite lors du retrait sur mise, veuillez réessayer!!!");
                  alert.present();
                });
              }
            }]
        });
        alert.present();
      } else if (result == 'RETRAIT') {
        let nbPre = 0;
        if (compte.produit)
          nbPre = compte.produit.nbreMisePrelever || 0;
        let montantARetirer = 0;
        montantARetirer = compte.montantSouscritTontine * (compte.miseTontine - nbPre - (compte.nbMiseRetirer || 0));
        console.log(compte.montantSouscritTontine, compte.miseTontine, nbPre, compte.nbMiseRetirer, montantARetirer);
        let name = '';
        if (compte.client) {
          name = `${compte.client.name} ${compte.client.firstName}`;
        }
        let alert = this.alertCtrl.create({
          title: "Cloture du compte tontine",
          message: `Le client ${name} va recevoir la somme de ${montantARetirer}`,
          buttons: [
            'Annuler',
            {
              text: 'OK',
              handler: () => {
                let loading = this.loadingCtrl.create({
                  content: 'Cloture du compte ...',
                  enableBackdropDismiss: false
                });
                loading.present();
                this.dataProvider.cloturerCompte(compte).then(() => {
                  loading.dismiss();
                  alert = this.alertCtrl.create({
                    buttons: ['OK']
                  });
                  alert.setMessage("Le compte a été cloturé avec succès");
                  alert.present();
                }).catch(() => {
                  loading.dismiss();
                  alert = this.alertCtrl.create({
                    buttons: ['OK']
                  });
                  alert.setMessage("Une erreur s'est produite lors de la cloture du compte, veuillez réessayer!!!");
                  alert.present();
                });
              }
            }]
        });
        alert.present();
      }
      else if (result == 'AVANCE') {
        let alert = this.alertCtrl.create({
          title: "Operation de demande d'avance",
          message: `Le client ${compte.client.name} ${compte.client.firstName} souhaitant faire une avance sur son compte à déjà fait ${compte.miseTontine} mise(s)`,
          inputs:[
           {
             name:"montant",
             placeholder:"Montant à retirer"
           }
          ],
          buttons: ['Annuler', {
            text: 'OK',
            handler: (data) => {
              let loading = this.loadingCtrl.create({
                content: "demande d'avance ...",
                enableBackdropDismiss: false
              });
              loading.present();
              this.dataProvider.accordAvance(compte,data.montant).then(() => {
                loading.dismiss();
                alert = this.alertCtrl.create({
                  buttons: ['OK']
                });
                alert.setMessage("L'avance a été accordé au client");
                alert.present();
              }).catch(() => {
                loading.dismiss();
                alert = this.alertCtrl.create({
                  buttons: ['OK']
                });
                alert.setMessage("Une erreur s'est produite lors de l'accord de l'avance sur le compte, veuillez réessayer!!!");
                alert.present();
              });
            }
          }]
        });
        alert.present();
      }
      else if (result == 'MISES') {
        let modal = this.modalCtrl.create('MisesPage', { compte }, {
          enableBackdropDismiss: false
        });
        //modal.
        modal.present();
      }
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
    if (compte.typeCompte === 'EPARGNE' && compte.montant > 0) {
      window.alert('Le solde du compte est supérieur à zéro');
      return;
    }
    if (compte.typeCompte === 'TONTINE' && !compte.dateCloture) {
      return window.alert("Le compte n'est pas encore cloturé");
    }
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
                message: `Le client ${compte.client.name} ${compte.client.firstName} n'a pas été supprimé`,
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
      <button ion-item (click)="close('RETRAIT_SUR_MISE')" *ngIf="isNotFull && compte.miseTontine >= 2">Retrait sur mise</button>
      <button ion-item (click)="close('RETRAIT')" *ngIf="(compte.miseTontine >= 2 || isRetrait) && (!compte.avanceTontine || compte.produit.nbreMiseTotal <= compte.miseTontine) && !compte.dateCloture">Cloturer le compte</button>
      <button ion-item (click)="close('AVANCE')" *ngIf="!compte.avanceTontine && compte.typeCompte == 'TONTINE' && isAvance && !compte.dateCloture && ((compte.miseTontine || 0) < compte.produit.nbreMiseTotal)">Faire une avance</button>
      <button ion-item (click)="close('MISES')" *ngIf="compte && compte.miseTontine">Voir les mises</button>
<button ion-item (click)="close('PRINTER')" *ngIf="compte.miseTontine >= 1">Relevé de compte</button>
      </ion-list>
  `
})
export class TontineOptions {
  compte: Compte;
  isAvance: boolean = false;
  isRetrait: boolean = false;
  isNotFull: boolean = false;
  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
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
    if (!this.compte || this.compte.dateCloture || this.compte.miseTontine >= this.compte.produit.nbreMiseTotal) return false;
    return !this.compte.miseTontine || this.compte.miseTontine < this.compte.produit.nbreMiseTotal;
  }
  canAvance(): boolean {
    if (!this.compte) return false;
    return this.compte.produit.nbreMiseAvance <= this.compte.miseTontine;
  }
  close(result?: any) {
    this.viewCtrl.dismiss(result);
  }
}
