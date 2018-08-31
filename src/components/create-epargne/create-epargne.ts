import { Component, Input } from '@angular/core';

import { Compte } from '../../providers/data/model';

/**
 * Generated class for the CreateEpargneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-epargne',
  templateUrl: 'create-epargne.html'
})
export class CreateEpargneComponent {

  @Input('compte') epargne: Compte = {
    typeCompte: 'EPARGNE'
  };

  constructor() {
  }
  save() {
    this.epargne.typeCompte = 'EPARGNE';
    this.epargne.dateCompte = Date.now();
  }

}
