import { Component, Input } from '@angular/core';

import { DataProvider } from '../../providers/data/data';
import { Compte } from '../../providers/data/model';

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
  depots: any[];
  @Input() compte: Compte;
  montant: number = 0;
  constructor(public dataProvider: DataProvider) {

  }
  ngAfterViewInit() {
    this.dataProvider.getDepots().subscribe((depots: any[]) => {
      this.depots = [];
      depots.forEach((depot) => {
        if (this.compte && this.compte.idClient != depot.idClient) return;
        this.montant += +depot.montant;
        depot.client = this.dataProvider.getClientById(depot.idClient);
        this.depots.push(depot);
      });
    });
  }
}
