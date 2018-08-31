import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  constructor(public http: HttpClient) {
  }
  get userData() {
    return UserData.getInstance();
  }
  getClients(): Observable<any> {
    const options = this.createRequestOption();
    return this.http.get(`${this.BASE_URL}/api/clients`, options).map((res) => {
      UserData.getInstance().clients = res;
      return res;
    });
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