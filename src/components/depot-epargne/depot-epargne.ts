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
  depots: any[] = [];
  constructor(public dataProvider: DataProvider) {
    this.dataProvider.getDepots().subscribe((depots:any[]) => {
      this.depots = depots.map((depot) => {
        depot.client = this.dataProvider.getClientById(depot.idClient);
        return depot;
      });
    });
  }

}
