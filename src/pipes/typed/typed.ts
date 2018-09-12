import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TypedPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'typed'
})
export class TypedPipe implements PipeTransform {

  transform(value: any[], type: string): any[] {
    if (!type) return value;
    type = type.toUpperCase();
    return value.filter((value) => {
      return value.typeProduit === type;
    });
  }
}
