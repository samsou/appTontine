import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { DataProvider } from './../../providers/data/data';

/**
 * Generated class for the RessourcesDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hasRessources]' // Attribute selector
})
export class RessourcesDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private dataProvider: DataProvider
  ) { }

  @Input()
  set hasRessources(value: string | string[]) {
    this.updateView(value);
    this.dataProvider.authenticationState.subscribe(() => {
      this.updateView(value);
    });
  }

  private updateView(value: string | string[]): void {
    let ressources = [];
    value = Array.isArray(value) ? value : [value];
    if (!this.dataProvider.isLogged || !this.dataProvider.user || !this.dataProvider.user.permissions) {
      value = [];
    }
    if (this.dataProvider.user)
      ressources = this.dataProvider.user.permissions;
    this.viewContainerRef.clear();
    let index = -1;
    for (let item of value) {
      item = item ? item.trim() : item;
      let findexIndex = ressources.findIndex((each) => {
        return each === item || each.code === item;
      });
      if (findexIndex !== -1)
        index = 1;
    }
    if (!value[0]) index = 1;
    if (index !== -1) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

}

