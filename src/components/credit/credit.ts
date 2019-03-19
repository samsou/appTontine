import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  PopoverController,
  ToastController,
  ViewController,
} from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Compte } from '../../providers/data/model';

/**
 * Generated class for the EpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'credit',
  templateUrl: 'credit.html'
})
export class CreditComponent {
  credits: Compte[];
  accorde: any;
  enAttente: any;
  montantTotalCredit: number = 0;

  constructor(private popoverCtrl: PopoverController, public dataProvider: DataProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private currencyPipe: CurrencyPipe, private navCtrl: NavController) {
  }
  ngAfterViewInit() {
    this.getComptes();
  }
  getComptes() {
    this.dataProvider.getComptes('CREDIT').subscribe((comptes: Compte[]) => {
      this.credits = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        compte.produit = this.dataProvider.getProduitById(compte.idProduit);
        this.montantTotalCredit += +compte.montantDemande || 0;
        return compte;
      });
    }, (err) => {
    });
  }
  openOptions(myEvent, compte: Compte) {
    let popover = this.popoverCtrl.create(CreditOptions);
    let resultIssue: Alert = this.alertCtrl.create({
      buttons: [
        {
          text: 'Ok',
          handler: () => {

          }
        }
      ]
    });
    let loading = this.loadingCtrl.create({
      enableBackdropDismiss: false,
    });
    popover.onDidDismiss((result) => {
      if (result === 'PRINTER') {
        this.navCtrl.push(
          'RelevePage', {
            action: 'RELEVE',
            model: {
              ...compte,
              type: 'EPARGNE'
            }
          }
        );
      }else if (result == 'DEPOT') {
        let alert = this.alertCtrl.create({
          title: `Dépôt sur le compte de ${compte.client.name}`,
          message: `Voulez-vous déposer combien?`,
          inputs: [
            {
              placeholder: 'Montant',
              type: 'number',
              name: 'montant'
            },
            {
              placeholder: 'Nom du déposant',
              type: 'text',
              name: 'nameDeposant'
            },
            {
              placeholder: 'Téléphone du déposant',
              type: 'text',
              name: 'phoneDeposant'
            },
            {
              placeholder: 'numéro de pièce',
              type: 'text',
              name: 'numCarteDeposant'
            }
          ],
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Annuler'
            },
            {
              text: 'Valider',
              handler: (data) => {
                // data.montant = data.montant.replace(/[ -_a-zA-Z]+/g, '');
                if (data.montant && +data.montant) {
                  // console.log(data.montant);
                  loading.present();
                  this.dataProvider.faireDepot(
                    {
                      numCarteDeposant: data.numCarteDeposant,
                      phoneDeposant: data.phoneDeposant,
                      nameDeposant: data.nameDeposant,
                      montant: +data.montant,
                      compte: compte.id,
                      idClient: compte.client.id,
                    },
                    (+data.montant) + (+compte.montant)
                  ).then(() => {
                    loading.dismiss();
                    resultIssue.setMessage(`Le dépôt de ${data.montant} a été effectué avec succès sur le compte du client ${compte.client.name} ${compte.client.firstName}`);
                    resultIssue.present();
                    this.navCtrl.push(
                      'RelevePage', {
                        action: 'QUITTANCE',
                        model: {
                          ...compte,
                          ...data,
                          type: 'DEPOT'
                        }
                      }
                    );
                  }).catch(() => {
                    resultIssue.setMessage(`Le dépôt de ${data.montant} sur le compte du client ${compte.client.name} ${compte.client.firstName} a échoué `);
                    resultIssue.present();
                  });
                } else {
                  console.log(data.montant);
                  resultIssue.setMessage(`Le montant ${data.montant} est incorrect`);
                  resultIssue.present();
                }
              }
            }
          ]
        });
        alert.present();
      } else if (result == 'SHOW_DEPOT') {
        let modal = this.modalCtrl.create('WrapperPage', { compte, type: 'DepotEpargneComponent' }, {
          enableBackdropDismiss: false
        });
        modal.present();
      }else if (result == 'SHOW_RETRAIT') {
        let modal = this.modalCtrl.create('WrapperPage', { compte, type: 'RetraitEpargneComponent' }, {
          enableBackdropDismiss: false
        });
        modal.present();
      }else if (result == 'RETRAIT') {
        let alert = this.alertCtrl.create({
          title: `Retrait sur le compte de ${compte.client.name}`,
          message: `Voulez-vous retirer combien?`,
          inputs: [
            {
              placeholder: 'Montant',
              type: 'number',
              name: 'montant'
            },
            {
              placeholder: 'Nom du retirant',
              type: 'text',
              name: 'nameRetirant'
            }, {

              placeholder: 'Téléphone du retirant',
              type: 'text',
              name: 'phoneRetirant'
            },
            {
              placeholder: 'numéro de pièce',
              type: 'text',
              name: 'numCarteRetirant'
            }
          ],
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Annuler'
            },
            {
              text: 'Valider',
              handler: (data) => {
                // data.montant = data.montant.replace(/[ -_a-zA-Z]+/g, '');
                if (data.montant && +data.montant) {
                  if (+data.montant > +compte.montant) {
                    resultIssue.setMessage(`Vous ne pouvez pas retirer cette somme.Le montant est insuffisant sur le compte.`);
                    resultIssue.present();
                    return;
                  }
                  loading.setContent("Retrait ...");
                  loading.present();
                  this.dataProvider.faireRetrait(
                    {
                      numCarteRetirant: data.numCarteRetirant,
                      phoneRetirant: data.phoneRetirant,
                      nameRetirant: data.nameRetirant,
                      montant: +data.montant,
                      compte: compte.id,
                      idClient: compte.client.id
                    },
                    (+compte.montant) - (+data.montant)
                  ).then((result) => {
                    loading.dismiss();
                    resultIssue.setMessage(`Le retrait de ${data.montant} a été effectué avec succès sur le compte du client ${compte.client.name} ${compte.client.firstName}`);
                    resultIssue.present();
                    this.navCtrl.push(
                      'RelevePage', {
                        action: 'QUITTANCE',
                        model: {
                          ...compte,
                          ...data,
                          type: 'RETRAIT'
                        }
                      }
                    );
                  }).catch(() => {
                    resultIssue.setMessage(`Le retrait de ${data.montant} sur le compte du client ${compte.client.name} ${compte.client.firstName} a échoué `);
                    resultIssue.present();
                  });
                } else {
                  resultIssue.setMessage(`Le montant est incorrect`);
                  resultIssue.present();
                }
              }
            }
          ]
        });
        alert.present();
      }
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
                  message: `Le solde sur le compte epargne du client ${name} est ${this.currencyPipe.transform(compte.montant, 'XOF', true, '2.0') || '00'}`,
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
    let modal = this.modalCtrl.create('WrapperPage', { compte, type: 'CreateCreditComponent' }, {
      enableBackdropDismiss: false
    });
    modal.present();
  }
  delete(compte: Compte) {
    // if (compte.typeCompte === 'CREDIT') {
    //   window.alert('Le solde du compte est supérieur à zéro');
    //   return;
    // }
    // if (compte.typeCompte === 'CREDIT' && !compte.dateCloture) {
    //   return window.alert("Le compte n'est pas encore cloturé");
    // }
    let name: string = '';
    if (compte.client) {
      name = compte.client.name + ' ' + compte.client.firstName;
    }
    let alert = this.alertCtrl.create({
      title: "Suppression d'un compte crédit",
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
                message: `Le compte Crédit du client ${compte.client.name} ${compte.client.firstName} a été supprimé`,
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
      <button ion-item (click)="close('SHOW_DEPOT')">Voir les dépôts</button>
      <button ion-item (click)="close('RETRAIT')">Faire un retrait</button>
      <button ion-item (click)="close('SHOW_RETRAIT')">Voir les retraits</button>
      <button ion-item (click)="close('SOLDE')">Consulter solde</button>
      <button ion-item (click)="close('PRINTER')">Relevé de compte</button>
    </ion-list>
  `
})
export class CreditOptions {
  constructor(public viewCtrl: ViewController) { }

  close(result?) {
    this.viewCtrl.dismiss(result);
  }
}
