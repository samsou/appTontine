import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';
import { Client, Settings } from '../../providers/data/model';

/**
 * Generated class for the AddClientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-client',
  templateUrl: 'add-client.html',
})
export class AddClientPage {
  client: Client = {};
  isSaving: boolean = false;
  setting : Settings;
  constructor(public navCtrl: NavController, private navParams: NavParams, private viewctrl: ViewController, private dataProvider: DataProvider, private toastCtrl: ToastController) {
    this.client = this.navParams.get('client') || {};
    this.client = Object.assign({}, this.client);
  }

  getSetting() {
    this.dataProvider.getSettings().subscribe((sett: Settings) => {
      this.setting = sett;
    }, (err) => {
    });
  }

  ngOnInit(){
    this.getSetting();
  }


  save() {
    if(!this.client.code)
    {
      let iniFirstName=this.client.firstName.slice(0,1).toUpperCase();
      let iniName=this.client.name.slice(0,1).toUpperCase();
      let newOrdre= parseInt(this.setting.numOrdreClient)+1;
      this.setting.numOrdreClient=newOrdre;
      let codeSercret=this.setting.codeSecretInstitution;
      let numClient=codeSercret+iniFirstName+iniName+'000'+newOrdre
      this.client.code=numClient;
    }
    this.isSaving = true;
    let message='';
    this.dataProvider.addClient(this.client).then((client) => {
      this.dataProvider.updateSettings(this.setting).then(() => {
        //this.isSaving = false;
       // this.close();
      }).catch(() => {
        this.isSaving = false;
        message ='Une erreur est survenu lors de la création du client, Réessayez plutard  !!!';
      });
      this.isSaving = false;
      this.close(this.client);
    }).catch((err) => {
      this.isSaving = false;
       message = `Une erreur s'est produite lors de la création du client ${this.client.name} ${this.client.firstName}`;
      if (this.client.id) {
        message = `Une erreur s'est produite lors de la modification du client ${this.client.name} ${this.client.firstName}`;
      }
      let toast = this.toastCtrl.create({
        message: message, duration: 2000,
        position: 'bottom'
      });
      toast.present();
    });
  }
  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
