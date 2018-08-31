import { Component } from '@angular/core';

/**
 * Generated class for the StatsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'stats',
  templateUrl: 'stats.html'
})
export class StatsComponent {

  text: string;

  constructor() {
    console.log('Hello StatsComponent Component');
    this.text = 'Hello World';
  }

}
