import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

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
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input()
  set hasRessources(value: string | string[]) {
    this.updateView(value);
  }

  private updateView(value: string | string[]): void {
    let ressources = [];
    value = Array.isArray(value) ? value : [value];
    this.viewContainerRef.clear();
    let index = -1;
    for (let item of value) {
      item = item ? item.trim() : item;
      if (ressources.indexOf(item) != -1) index = 1;
    }
    if (!value[0]) index = 1;
    if (index != -1) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

}
