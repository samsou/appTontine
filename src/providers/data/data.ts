import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Client, Compte, Mise, Settings } from './model';
import { UserData } from './userdata';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  isLogged: boolean = false;
  private BASE_URL: string = 'http://localhost';
  clientsCollection: AngularFireObject<any>;
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    this.clientsCollection = this.db.object('clients');
    this.getSettings().subscribe(() => { }, () => { });
    this.getClients().subscribe(() => { }, () => { });
    this.getComptes('TONTINE').subscribe(() => { }, () => { });
    this.getComptes('EPARGNE').subscribe(() => { }, () => { });
  }
  get userData() {
    return UserData.getInstance();
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

  addMise(ms: Mise): Promise<any> {
    let mise = Object.assign({}, ms);
    delete mise.client;
    delete mise.compte;
    mise.date = Date.now();
    return Promise.resolve(this.db.list(`mises`).push(mise));

  }
  getClientById(idClient: any) {
    return this.userData.clientsMap[idClient];
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
  addCompte(cpte: Compte): Promise<any> {
    let compte = Object.assign({}, cpte);
    delete compte.client;
    if (!compte.id) {
      compte.dateCompte = Date.now();
      return Promise.resolve(this.db.list(`comptes/${compte.typeCompte}`).push(compte));
    } else {
      return this.db.object(`comptes/${compte.typeCompte}/${compte.id}`).update(compte);
    }
  }
  removeCompte(compte: Compte): Promise<any> {
    if (!compte.id) return Promise.reject('No_Id');
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
      client.date = Date.now();
      return Promise.resolve(this.db.list('clients').push(client));
    } else {
      return this.db.object(`clients/${client.id}`).update(client);
    }
  }
  removeClient(client: Client): Promise<any> {
    if (!client.id) return Promise.reject('No_Id');
    return this.db.object(`clients/${client.id}`).remove();
  }
  login(model: any): Observable<any> {
    const options = this.createRequestOption();
    return this.http.get(`${this.BASE_URL}/api/login`, options);
  }
  logout() {
    this.isLogged = false;
    //return this.http.get('', this.createRequestOption());
  }
  private createRequestOption(req?: any): RequestOptions {
    const options: RequestOptions = {
      responseType: 'json'
    };
    const params: HttpParams = new HttpParams();
    if (req) {
      if (req.page) params.set('page', req.page);
      if (req.size) params.set('size', req.size);
      if (req.sort) {
        req.sort = Array.isArray(req.sort) ? req.sort.join(',') : req.sort;
        req.sort = req.sort.replace(/asc/i, 'desc');
        params.set('sort', req.sort);
      }
      if (req.query) params.set('query', req.query);
      let queries: any = req;
      //if (!req.NO_QUERY) queries = Object.assign({}, req, createQueries());
      for (let param in queries) {
        if (
          ['page', 'size', 'sort', 'query', 'NO_QUERY'].indexOf(param) ==
          -1
        ) {
          if (queries[param]) params.set(param, queries[param]);
        }
      }
      options.params = params;
    }
    options.params = params;
    options.headers = new HttpHeaders();
    options.headers.append('accept', '*/*');
    options.headers.append(
      'Access-Control-Allow-Headers',
      'X-Total-Count, Link'
    );
    options.headers.append('Access-Control-Allow-Origin', '*');

    let token =
      window.sessionStorage.getItem('jhi-authenticationtoken') ||
      window.localStorage.getItem('jhi-authenticationtoken');

    if (token) {
      token = token.replace(/^["']/, '');
      token = token.replace(/["']$/, '');
      options.headers.append('Authorization', 'Bearer ' + token);
    }
    return options;
  };

}
interface RequestOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType: 'json';
  withCredentials?: boolean;
}