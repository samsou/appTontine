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
  selector: 'create-tontine',
  templateUrl: 'create-tontine.html'
})
export class CreateTontineComponent {
  isSaving: boolean = false;
  @Input('compte') tontine: Compte = {
    typeCompte: 'TONTINE'
  };
  client: Client = {};
  private _produit: Produit = {};

  constructor(public dataProvider: DataProvider, private toastCtrl: ToastController, private viewCtrl: ViewController,private modalCtrl: ModalController) {
  }
  get produit() {
    if (this.tontine && this.tontine.id)
      return this.tontine.produit;
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
this.tontine.idClient = result.id;
      }
    });
    modal.present();
  }
  save() {
    this.isSaving = true;
    if (!this.tontine.id) {
      this.tontine.typeCompte = 'TONTINE';
      this.tontine.miseTontine = 0;
      this.tontine.dateCompte = Date.now();
    } else {
      this.client = this.tontine.client;
      this.produit = this.tontine.produit;
    }
    this.dataProvider.addCompte(this.tontine).then(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Le compte tontine du client ${this.client.name} a été ${!this.tontine.id ? 'crée' : 'modifié'}`,
        position: 'bottom',
        duration: 2000
      });
      toast.present();
      this.tontine.idClient = null;
      this.tontine.montantSouscritTontine = null;
      this.tontine.idProduit = null;
      this.client = null;
      if (this.tontine.id) this.viewCtrl.dismiss();
    }).catch(() => {
      this.isSaving = false;
      let toast = this.toastCtrl.create({
        message: `Une erreur s'est produite lors de la ${!this.tontine.id ? 'création' : 'modification'} d'un compte tontine du client ${this.client.name}`,
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }

}
