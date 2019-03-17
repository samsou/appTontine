import { Pipe, PipeTransform } from '@angular/core';

import { Compte } from '../../providers/data/model';

/**
 * Generated class for the CloturerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cloturer',
})
export class CloturerPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Compte[], isCloturer: boolean, field = "dateCloture"): Compte[] {
    if (isCloturer == null || isCloturer == undefined) return value;
    return value.filter((el) => {
      return isCloturer ? !!el[field] : !el[field];
    });
  }
}
