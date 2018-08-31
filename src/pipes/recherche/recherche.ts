import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "recherche" })
export class RecherchePipe implements PipeTransform {
  transform(value: any[], search: string = ""): any[] {
    if (!search) return value;
    search = search.trim();
    if (!Array.isArray(value) || !value || !value.length) return [];
    let check: boolean = false;
    return value.filter((current, i) => {
      check = false;
      for (var key in current) {
        if (
          typeof current[key] == "string" ||
          typeof current[key] == "number" ||
          typeof current[key] == "boolean" ||
          Array.isArray(current[key])
        ) {
          let courant = Array.isArray(current[key])
            ? current[key].join(" ")
            : current[key] + "";
          if (courant.toLowerCase().indexOf(search.toLowerCase()) != -1) {
            check = true;
            break;
          }
        }
      }
      return check;
    });
  }
}
