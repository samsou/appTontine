import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ClientSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-client-search',
  templateUrl: 'client-search.html',
})
export class ClientSearchPage {
  searchText: string = '';
  title: string;
  selected: any;
  id: any;
  items: any[];

  constructor(public navCtrl: NavController, private viewctrl: ViewController, public navParams: NavParams) {
    this.title = navParams.get('title');
    this.items = navParams.get('items');
    this.id = navParams.get('id');
    this.selected = this.id;
  }
  getSelected(clt: any): any {
    this.selected = clt;
  }
  close(result?: any) {
    this.viewctrl.dismiss(result);
  }

}
