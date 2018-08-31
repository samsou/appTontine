import { Component, Input } from '@angular/core';

import { Compte } from './../../providers/data/model';

/**
 * Generated class for the CreateTontineComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-tontine',
  templateUrl: 'create-tontine.html'
})
export class CreateTontineComponent {

  @Input('compte') tontine: Compte = {
    typeCompte: 'TONTINE'
  };

  constructor() {
  }
  save() {
    this.tontine.typeCompte = 'TONTINE';
    this.tontine.dateCompte = Date.now();
  }

}
