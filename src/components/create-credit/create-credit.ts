import { Component, Input } from '@angular/core';
import { ToastController, ViewController,ModalController } from 'ionic-angular';
import { DataProvider } from './../../providers/data/data';
import { Client, Compte, Produit,Echeance } from './../../providers/data/model';

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
  isOk=false;
  // //if(this.credit.client.fraisOuverture==undefined); //|| (this.credit.client.fraisOuverture==null) || this.credit.client.isFraisOk==false
  // if(typeof this.credit.client.fraisOuverture==undefined !== "undefined") {
  //   // do something with foo
  // }
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
      this.credit.deposit = 0;
      this.credit.depositRetire = false;
      this.credit.fini=false;
      this.credit.dateCompte = Date.now();
    } else {
      if(this.credit.etatDemande=='ACCORDE'){
        this.credit.accordDate = Date.now();
        this.credit.accordeCredit = true;
        // this.credit.montant = this.credit.montantDemande;
        // this.credit.libelle='Accord de crédit'
        //let echs: Echeance[]=[];
       // echs.length
      }

      this.client = this.credit.client;
      this.produit = this.credit.produit;
    }
    this.dataProvider.addCompte(this.credit).then(() => {
      if(this.credit.etatDemande==='ACCORDE'){
        //let echs: Echeance[]=[];
        for (let i = 0; i < this.credit.produit.nbreEcheance; i++) {
          let e : Echeance={}; let x : number; let tau:number;
          e.idCompte=this.credit.id;
          e.num=i+1;
          e.nominal=this.credit.montantDemande/this.credit.produit.nbreEcheance;
          let dat:any = new Date;
          //dat = dat.now();
          if(this.credit.produit.periodicite=='JOURNALIER'){
            x=1+1*i;
            e.date=dat.setDate(dat.getDate() + x);
            tau=+this.credit.produit.tauxAnnuel*1/365;
          }else if(this.credit.produit.periodicite=='HEBDOMADAIRE'){
            x=1+7*i;
            e.date=dat.setDate(dat.getDate() + x);
            tau=+this.credit.produit.tauxAnnuel*7/365;
          }else if(this.credit.produit.periodicite=='MENSUELLE'){
            x=1+1*i;
            e.date=dat.setMonth(dat.getMonth() + x);
            tau=+this.credit.produit.tauxAnnuel*1/12;
          }else if(this.credit.produit.periodicite=='TRIMESTRIELLE'){
            x=1+3*i;
            e.date=dat.setMonth(dat.getMonth() + x);
            tau=+this.credit.produit.tauxAnnuel*3/12;
          }else if(this.credit.produit.periodicite=='SEMESTRIELLE'){
            x=1+6*i;
            e.date=dat.setMonth(dat.getMonth() + x);
            tau=+this.credit.produit.tauxAnnuel*6/12;
          }else if(this.credit.produit.periodicite=='ANNUELLE'){
            x=1+12*i;
            e.date=dat.setMonth(dat.getMonth() + x);
            tau=this.credit.produit.tauxAnnuel;
          }
          e.interet=this.credit.montantDemande*tau/100;
          e.payer=false;
          //echs.push(e);
          this.dataProvider.addEcheance(e).then(() => {}).catch(()=> {});
          console.log(e);
        }
        let model= {
          compte:this.credit.id,
          date:this.credit.accordDate,
          idClient:this.credit.client.id,
          montant:this.credit.montantDemande,
          nameDeposant:'Accord de credit',
          numCarteDeposant:'CARTE DE LA SOCIETE',
          phoneDeposant:'PHONE DE LA SOCIETE'
        }
        this.dataProvider.faireDepot(model,model.montant,'CREDIT').then(() => {}).catch(()=> {});

      }
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
    }).catch((e) => {
      console.log(e);
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
