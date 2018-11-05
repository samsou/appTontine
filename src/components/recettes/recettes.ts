import { Component } from '@angular/core';

import { DataProvider } from '../../providers/data/data';


@Component({
  selector: 'recettes',
  templateUrl: 'recettes.html'
})
export class RecettesComponent {
  recettes: any[];
  montant: number = 0;

  constructor(public dataProvider: DataProvider) {
  }

  ngOnInit() {
    this.getRecettes();
  }
  client(idClient) {
    let clt = this.dataProvider.getClientById(idClient);
    if (!clt) return '';
    return clt.name + ' ' + clt.firstName;
  }

  getRecettes() {
    this.recettes = this.dataProvider.userData.RECETTES;
    this.dataProvider.getComptes('RECETTES').subscribe((recettes: any[]) => {
      this.recettes = recettes;
      this.recettes.forEach((rec) => {
        this.montant += +rec.montant;
        this.dataProvider.removeCompte(rec);
      });
    }, (err) => {
    });
  }
}
