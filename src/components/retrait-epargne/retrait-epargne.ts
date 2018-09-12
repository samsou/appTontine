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
  retraits: any[] = [];
  constructor(public dataProvider: DataProvider) {
    this.dataProvider.getRetraits().subscribe((retraits: any[]) => {
      this.retraits = retraits.map((retrait) => {
        retrait.client = this.dataProvider.getClientById(retrait.idClient);
        return retrait;
      });
    });
  }

}
