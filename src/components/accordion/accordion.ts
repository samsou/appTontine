import { Component, ElementRef, Input, Renderer, ViewChild } from '@angular/core';

/**
 * Generated class for the AccordionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion.html'
})
export class AccordionComponent {
  @Input() headerColor: string = '#f8f8f8';
  @Input() textColor: string = '#FFF';
  @Input() contentColor: string = '#F9F9F9';
  @Input() title: string;
  @Input() icon: string;
  @Input() hasMargin: boolean = true;
  @Input() expanded: boolean;
  @Input() hasContent: boolean = true;
 
  @ViewChild('accordionContent') elementView: ElementRef;

  viewHeight: number;

  constructor(public renderer: Renderer) { }

  ngAfterViewInit() {
    this.viewHeight = this.elementView.nativeElement.offsetHeight;

    if (!this.expanded) {
      this.renderer.setElementStyle(this.elementView.nativeElement, 'height', 0 + 'px');
    }
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
    const newHeight = this.expanded ? '100%' : '0px';
    this.renderer.setElementStyle(this.elementView.nativeElement, 'height', newHeight);
  }

}
