import { Component } from '@angular/core';
import { AlertController, ModalController, ToastController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Produit } from '../../providers/data/model';

/**
 * Generated class for the ProduitComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'produit',
  templateUrl: 'produit.html'
})
export class ProduitComponent {

  typeCompte: string = 'tontine';
  produits: Produit[];
  constructor(public dataProvider: DataProvider, private modalCtrl: ModalController, private toastCtrl: ToastController, private alertCtrl: AlertController) {
  }
  ngAfterViewInit() {
    this.getProduits();
  }
  getProduits() {
    this.dataProvider.getProduits().subscribe((produits: Produit[]) => {
      this.produits = produits;
      console.log(produits);
    }, (err) => {
    });
  }
  delete(produit: Produit) {
    let alert = this.alertCtrl.create({
      title: "Suppression d'un client",
      message: `Voulez-vous supprimer le produit ${produit.libelle}?`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.dataProvider.removeProduit(produit).then(() => {
              let toast = this.toastCtrl.create({
                message: `Le produit ${produit.libelle} a été supprimé`,
                duration: 2000,
                position: 'bottom'
              });
              toast.present();
            }).catch(() => {
              let toast = this.toastCtrl.create({
                message: `Le produit ${produit.libelle} n'a pas été supprimé`,
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
  edit(produit: Produit) {
    let modal = this.modalCtrl.create('CreateProduitPage', { produit }, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result: Produit) => {
      if (result == null) return;
      let toast = this.toastCtrl.create({
        message: `Le produit ${result.libelle} a été modifié`,
        duration: 2500,
        position: 'bottom'
      });
      toast.present();
    });
    modal.present();
  }
  addProduit() {
    let modal = this.modalCtrl.create('CreateProduitPage', null, {
      enableBackdropDismiss: false
    });
    modal.onDidDismiss((result: Produit) => {
      if (result == null) return;
      let toast = this.toastCtrl.create({
        message: `Le produit ${result.libelle} a été crée`,
        duration: 2500,
        position: 'bottom'
      });
      toast.present();
    });
    modal.present();
  }

}
