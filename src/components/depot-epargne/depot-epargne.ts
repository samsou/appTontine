import { Component } from '@angular/core';

import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the DepotEpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'depot-epargne',
  templateUrl: 'depot-epargne.html'
})
export class DepotEpargneComponent {
  epargnes: any[] = [];
  constructor(public dataProvider: DataProvider) {
  }

}
