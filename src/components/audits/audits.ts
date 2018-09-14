import { Component } from '@angular/core';

/**
 * Generated class for the AuditsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'audits',
  templateUrl: 'audits.html'
})
export class AuditsComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
