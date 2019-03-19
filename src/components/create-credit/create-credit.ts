import { Component, Input } from '@angular/core';
import { ToastController, ViewController,ModalController } from 'ionic-angular';
import { DataProvider } from './../../providers/data/data';
import { Client, Compte, Produit } from './../../providers/data/model';

/**
 * Generated class for the CreateTontineComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-credit',
  templateUrl: 'create-credit.html'
})
export class CreateCreditComponent {
  isSaving: boolean = false;
  @Input('compte') credit: Compte = {
    typeCompte: 'CREDIT'
  };
  client: Client = {};
  private _produit: Produit = {};

  constructor(public dataProvider: DataProvider, private toastCtrl: ToastController, private viewCtrl: ViewController,private modalCtrl: ModalController) {
  }
  get produit() {
    if (this.credit && this.credit.id)
      return this.credit.produit;
    return this._produit;
  }
  set produit(newProd) {
    this._produit = newProd;
  }

  getSelected(clt: Client): any {
    this.client = clt;
    return clt.id;
  }
  getSelectedProduit(produit: Produit): any {
    this.produit = produit;
    return produit.id;
  }
  openSearch(){
    if(!(this.dataProvider.userData.clients && this.dataProvider.userData.clients.length > 3)) return ;
     let modal = this.modalCtrl.create('ClientSearchPage', { items:this.dataProvider.userData.clients, title: 'Sélectionnez le client',id: this.client}, {
      enableBackdropDismiss: false,
      'cssClass':'client-search'
    });
    modal.onDidDismiss((result)=>{
      if(result){
this.client = result;
this.credit.idClient = result.id;
      }
    });
    modal.present();
  }
  save() {
    this.isSaving = true;
    if (!this.credit.id) {
      this.credit.typeCompte = 'CREDIT';
      //this.credit.miseTontine = 0;
      this.credit.dateCompte = Date.now();
    } else {
      this.client = this.credit.client;
      this.produit = this.credit.produit;
    }
    this.dataProvider.addCompte(this.credit).then(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Le compte crédit du client ${this.client.name} a été ${!this.credit.id ? 'crée' : 'modifié'}`,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
      this.credit.idClient = null;
      //this.credit.montantSouscritTontine = null;
      this.credit.idProduit = null;
      this.client = null;
      if (this.credit.id) this.viewCtrl.dismiss();
    }).catch(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Une erreur s'est produite lors de la ${!this.credit.id ? 'création' : 'modification'} d'un compte crédit du client ${this.client.name}`,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

}
