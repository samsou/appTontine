import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  LoadingController,
  ModalController,
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
  selector: 'epargne',
  templateUrl: 'epargne.html'
})
export class EpargneComponent {
  epargnes: Compte[] = [];

  constructor(private popoverCtrl: PopoverController, public dataProvider: DataProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
  }
  ngAfterViewInit() {
    this.getComptes();
  }
  getComptes() {
    this.dataProvider.getComptes('EPARGNE').subscribe((comptes: Compte[]) => {
      this.epargnes = comptes.map((compte) => {
        compte.client = this.dataProvider.getClientById(compte.idClient);
        compte.produit = this.dataProvider.getProduitById(compte.idProduit);
        return compte;
      });
    }, (err) => {
    });
  }
  openOptions(myEvent, compte: Compte) {
    let popover = this.popoverCtrl.create(EpargneOptions);
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
      if (result == 'DEPOT') {
        let alert = this.alertCtrl.create({
          title: `Dépôt sur le compte de ${compte.client.name}`,
          message: `Voulez-vous déposer combien?`,
          inputs: [
            {
              placeholder: 'Montant',
              type: 'text',
              name: 'montant'
            },
            {
              placeholder: 'Nom du déposant',
              type: 'text',
              name: 'nameDeposant'
            }, {

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
                data.montant = data.montant.replace(/[ -]+/g, '');
                if (data.montant && +data.montant) {
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
                  }).catch(() => {
                    resultIssue.setMessage(`Le dépôt de ${data.montant} sur le compte du client ${compte.client.name} ${compte.client.firstName} a échoué `);
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
      else if (result == 'RETRAIT') {
        let alert = this.alertCtrl.create({
          title: `Retrait sur le compte de ${compte.client.name}`,
          message: `Voulez-vous retirer combien?`,
          inputs: [
            {
              placeholder: 'Montant',
              type: 'text',
              name: 'montant'
            },
            /* {
              label: 'Nom du déposant',
              type: 'text',
              name: 'nameDeposant'
            }, {

              label: 'Téléphone du déposant',
              type: 'text',
              name: 'phoneDeposant'
            },
            {
              label: 'numéro de pièce',
              type: 'text',
              name: 'numCarteDeposant'
            } */
          ],
          enableBackdropDismiss: false,
          buttons: [
            {
              text: 'Annuler'
            },
            {
              text: 'Valider',
              handler: (data) => {
                data.montant = data.montant.replace(/[ -]+/g, '');
                if (data.montant && +data.montant) {
                  if (+data.montant >= compte.montant) {
                    resultIssue.setMessage(`Vous ne pouvez pas retirer cette somme.Le montant est insuffisant.`);
                    resultIssue.present();
                    return;
                  }
                  loading.setContent("Retrait ...");
                  loading.present();
                  this.dataProvider.faireRetrait(
                    {
                      /* numCarteDeposant: data.numCarteDeposant,
                      phoneDeposant: data.phoneDeposant,
                      nameDeposant: data.nameDeposant, */
                      montant: +data.montant,
                      compte: compte.id,
                      idClient: compte.client.id
                    },
                    (+compte.montant) - (+data.montant)
                  ).then((result) => {
                    loading.dismiss();
                    resultIssue.setMessage(`Le retrait de ${data.montant} a été effectué avec succès sur le compte du client ${compte.client.name} ${compte.client.firstName}`);
                    resultIssue.present();
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
