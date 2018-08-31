import { Component } from '@angular/core';

import { DataProvider } from './../../providers/data/data';

/**
 * Generated class for the RetraitEpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'retrait-epargne',
  templateUrl: 'retrait-epargne.html'
})
export class RetraitEpargneComponent {
  epargnes: any[] = [];
  constructor(public dataProvider: DataProvider) {
  }

}
