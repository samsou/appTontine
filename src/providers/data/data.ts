import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Client, Compte, Mise, Produit, Settings } from './model';
import { RESSOURCES, UserData } from './userdata';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  isLogged: boolean = false;
  ressources: any[] = [];
  user: any = {};
  authenticationState = new Subject<any>();
  //private BASE_URL: string = 'http://localhost';
  clientsCollection: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase) {
    this.clientsCollection = this.db.object('clients');
    this.getSettings().subscribe(() => { }, () => { });
    this.getClients().subscribe(() => { }, () => { });
    this.getProduits().subscribe(() => { }, () => { });
    this.getComptes('TONTINE').subscribe(() => { }, () => { });
    this.getComptes('EPARGNE').subscribe(() => { }, () => { });
    this.getComptes('RECETTES').subscribe((recettes) => {
    }, () => { });
    this.ressources = RESSOURCES;

  }
  get userData() {
    return UserData.getInstance();
  }
  getDepots(): Observable<any[]> {
    return this.db.object('depots').valueChanges().map((clts) => {
      let depots: any = [];
      for (const key in clts) {
        depots.push({ id: key, ...clts[key] });
      }
      this.userData.depots = depots;
      return depots;
    });
  }
  getRetraits(): Observable<any[]> {
    return this.db.object('retraits').valueChanges().map((clts) => {
      let retraits: any = [];
      for (const key in clts) {
        retraits.push({ id: key, ...clts[key] });
      }
      this.userData.retraits = retraits;
      return retraits;
    });
  }
  faireDepot(model: any, montantTotal: number, typeCompte: string = 'EPARGNE'): Promise<any> {
    model.date = this.user.clotureDate || Date.now();
    return new Promise((resolve, reject) => {
      this.db.list(`depots`).push(model).then(() => {
        resolve(this.db.object(`comptes/${typeCompte}/${model.compte}`).update({ montant: montantTotal }));
      }, () => {
        reject([]);
      });
    });
  }
  faireRetrait(model: any, montantRestant: number, typeCompte: string = 'EPARGNE'): Promise<any> {
    model.date = this.user.clotureDate || Date.now();
    return new Promise((resolve, reject) => {
      this.db.list(`retraits`).push(model).then(() => {
        resolve(this.db.object(`comptes/${typeCompte}/${model.compte}`).update({ montant: montantRestant }));
      }, () => {
        reject([]);
      });
    });
  }
  getSettings(): Observable<Settings> {
    return this.db.object('settings').valueChanges().map((settings) => {
      if (settings)
        this.userData.settings = settings;
      return this.userData.settings;
    });
  }
  updateSettings(params: Settings): Promise<any> {
    let settings = Object.assign({}, params);
    return this.db.object('settings').update(settings).then(() => {
      if (settings)
        this.userData.settings = settings;
      return this.userData.settings;
    });
  }

  getMises(compte: Compte): Observable<any> {
    return this.db.object(`mises/${compte.id}`).valueChanges().map((value) => {
      let mises = [];
      for (const key in value) {
        if (value[key].idCompte == compte.id)
          mises.push({ id: key, ...value[key] });
      }
      return mises;
    });
  }

  addMise(ms: Mise): Promise<any> {
    let mise = Object.assign({}, ms);
    delete mise.client;
    delete mise.compte;
    mise.date = this.user.clotureDate || Date.now();
    return Promise.resolve(this.db.list(`mises/${ms.idCompte}`).push(mise));
  }
  cloturerCompte(cpte: Compte): Promise<any> {
    let compte = Object.assign({}, cpte);
    compte.dateCloture = this.user.clotureDate || Date.now();
    return this.addCompte(compte);
  }
  accordAvance(cpte: Compte,montant): Promise<any> {
    let compte = Object.assign({}, cpte);
    compte.avanceDate = this.user.clotureDate || Date.now();
    compte.avanceTontine = true;
    compte.montantAvance = montant;
    return this.addCompte(compte);
  }
  getClientById(idClient: any) {
    return this.userData.clientsMap[idClient];
  }
  getProduitById(idProduit: any) {
    return this.userData.produits.find((prdt) => {
      return prdt.id == idProduit;
    });
  }
  getComptes(typeCompte: string): Observable<Compte[]> {
    return this.db.object(`comptes/${typeCompte}`).valueChanges().map((clts) => {
      let comptes: Compte[] = [];
      for (const key in clts) {
        comptes.push({ id: key, ...clts[key] });
      }
      this.userData[typeCompte] = comptes.reverse();
      return comptes;
    });
  }
  deduireRecette(model) {
    if (model === true) return Promise.resolve('DEJA');
    let recette = Object.assign({}, model);
    recette.date = this.user.clotureDate || Date.now();
    return Promise.resolve(this.db.list(`comptes/RECETTES`).push(recette));
  }
  addCompte(cpte: Compte): Promise<any> {
    let compte = Object.assign({}, cpte);
    delete compte.client;
    delete compte.produit;
    if (!compte.id) {
      compte.dateCompte = this.user.clotureDate || Date.now();
      return Promise.resolve(this.db.list(`comptes/${compte.typeCompte}`).push(compte));
    } else {
      return this.db.object(`comptes/${compte.typeCompte}/${compte.id}`).update(compte);
    }
  }
  removeCompte(compte: Compte): Promise<any> {
    if (!compte.id) return Promise.reject('No_Id');
    if (compte.typeCompte === 'EPARGNE' && compte.montant > 0) {
      return Promise.reject('Montant supérieur à zéro');
    }
    if (compte.typeCompte === 'TONTINE' && +compte.miseTontine > 0 && !compte.dateCloture) {
      return Promise.reject('Compte non cloturé');
    }
    return this.db.object(`comptes/${compte.typeCompte}/${compte.id}`).remove();
  }
  getClients(): Observable<Client[]> {
    return this.clientsCollection.valueChanges().map((clts) => {
      let clients: any = {};
      for (const key in clts) {
        clients[key] = { id: key, ...clts[key] };
      }
      this.userData.clientsMap = clients;
      return this.userData.clients;
    });
  }
  addClient(client: Client): Promise<any> {
    if (!client.id) {
      client.date = this.user.clotureDate || Date.now();
      return Promise.resolve(this.db.list('clients').push(client));
    } else {
      return this.db.object(`clients/${client.id}`).update(client);
    }
  }
  async removeClient(client: Client): Promise<any> {
    if (!client.id) return Promise.reject('No_Id');
    let cptes = this.getClientAccounts(client.id);
    if (cptes && cptes.length) {
      let canDelete: boolean = true;
      cptes.forEach((c) => {
        if (c.typeCompte === 'EPARGNE' && +c.montant > 0) {
          canDelete = false;
        }
        if (c.typeCompte === 'TONTINE' && +c.miseTontine > 0 && !c.dateCloture) {
          canDelete = false;
        }
      });
      if (!canDelete) {
        return Promise.reject('cannotDeleteAccount');
      }
      let retraits: any[] = this.userData.retraits || [];
      let depots: any[] = this.userData.depots || [];
      for (let index = 0, len = depots.length; index < len; index++) {
        if (depots[index].client && depots[index].client.id === client.id) {
          try {
            await this.db.object(`depots/${depots[index].id}`).remove();
          } catch (error) {

          }
        }
      }
      for (let index = 0, len = retraits.length; index < len; index++) {
        if (retraits[index].client && retraits[index].client.id === client.id) {
          try {
            await this.db.object(`retraits/${retraits[index].id}`).remove();
          } catch (error) {

          }
        }
      }
      for (let index = 0, len = cptes.length; index < len; index++) {
        try {
          await this.removeCompte(cptes[index]);
        } catch (error) {

        }
      }
    }

    return this.db.object(`clients/${client.id}`).remove();
  }

  getProduits(): Observable<Produit[]> {
    return this.db.object(`produits`).valueChanges().map((prdts) => {
      let produits: Produit[] = [];
      for (const key in prdts) {
        produits.push({ id: key, ...prdts[key] });
      }
      this.userData.produits = produits.reverse();
      return produits;
    });
  }
  addProduit(produit: Produit): Promise<any> {
    // produit.montantMax = +produit.montantMax || 0;
    // produit.montantMin = +produit.montantMin || 0;
    // produit.nbreEcheance = +produit.nbreEcheance || 0;
    produit.nbreMiseAvance = +produit.nbreMiseAvance || 0;
    produit.nbreMisePrelever = +produit.nbreMisePrelever || 0;
    produit.nbreMiseTotal = +produit.nbreMiseTotal || 0;

    if (!produit.id) {
      produit.date = this.user.clotureDate || Date.now();
      return Promise.resolve(this.db.list('produits').push(produit));
    } else {
      return this.db.object(`produits/${produit.id}`).update(produit);
    }
  }
  removeProduit(produit: Produit): Promise<any> {
    if (!produit.id) return Promise.reject('No_Id');
    return this.db.object(`produits/${produit.id}`).remove();
  }
  getUsers(): Observable<any> {
    return this.db.object(`users`).valueChanges().map((us) => {
      let users: any[] = [];
      for (const key in us) {
        users.push({ id: key, ...us[key] });
      }
      return users;
    });
  }
  deleteUser(model): Promise<any> {
    return this.db.object(`users/${model.username}`).remove();
  }
  updateUser(model): Promise<any> {
    return this.db.object(`users/${model.username}`).update(model);
  }
  changePassword(model): Promise<any> {
    return this.db.object(`users/${model.username}`).update(model);
  }
  signUp(model: any): Promise<any> {
    model.date = this.user.clotureDate || Date.now();
    if (model.username === 'superadmin') {
      return Promise.reject('ALREADY');
    }
    return this.db.object(`users/${model.username}`).update(model);
  }
  login(model: any): Observable<any> {
    if (model.username === 'superadmin' && model.password === 'admin0123') {
      return Observable.create((observer) => {
        setTimeout(() => {
          observer.next(Object.assign({}, model, {
            isSuperAdmin: true,
            permissions: RESSOURCES
          }));
        }, 2000);
      });
    }
    return this.db.object(`users/${model.username}`).valueChanges();
  }
  getClientAccounts(idClient: any): Compte[] {
    if (!idClient) return [];
    let comptes = this.userData.EPARGNE.filter((epargne) => {
      return epargne.idClient == idClient;
    });
    let comptes2 = this.userData.TONTINE.filter((tontine) => {
      return tontine.idClient == idClient;
    });
    return comptes.concat(...comptes2);
  }
  logout(): Promise<any> {
    this.isLogged = false;
    this.user = {};
    this.authenticationState.next(false);
    return Promise.resolve(true);
  }
}
