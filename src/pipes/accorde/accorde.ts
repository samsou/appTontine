import { Pipe, PipeTransform } from '@angular/core';

import { Compte } from '../../providers/data/model';

/**
 * Generated class for the CloturerPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'accorde',
})
export class AccordePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: Compte[], isAccorde: boolean, field = "accordDate"): Compte[] {
    if (isAccorde == null || isAccorde == undefined) return value;
    return value.filter((el) => {
      return isAccorde ? !!el[field] : !el[field];
    });
  }
}
