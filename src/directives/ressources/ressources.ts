import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserData } from '../../providers/data/userdata';


@Directive({
  selector: '[hasAnyRessources]'
})
export class HasAnyRessourcesDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  @Input()
  set hasAnyRessources(value: string | string[]) {
    if (!value) {
      this.viewContainerRef.clear();
      return;
    }
    this.updateView(value);
  }

  private updateView(value: string | string[]): void {
    let ressources = UserData.getInstance().ressources;
    if (Array.isArray(value) && value[0] && value.length == 1) {
      this.viewContainerRef.clear();
    }
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
