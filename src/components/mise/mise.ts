import { Component } from '@angular/core';

/**
 * Generated class for the MiseComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mise',
  templateUrl: 'mise.html'
})
export class MiseComponent {

  text: string;

  constructor() {
    console.log('Hello MiseComponent Component');
    this.text = 'Hello World';
  }

}
