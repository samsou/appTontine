import { Component, Input } from '@angular/core';

import { Compte } from '../../providers/data/model';
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
  retraits: any[];
  @Input() compte: Compte;
  montant: number = 0;
  constructor(public dataProvider: DataProvider) {

  }
  ngAfterViewInit() {
    this.dataProvider.getRetraits().subscribe((retraits: any[]) => {
      this.retraits = [];
      retraits.forEach((retrait) => {
        if (this.compte && this.compte.idClient != retrait.idClient) {

        } else {
          this.montant += +retrait.montant;
          retrait.client = this.dataProvider.getClientById(retrait.idClient);
          this.retraits.push(retrait);
        }
      });
    });
  }

}
