import { Directive, HostListener, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Directive({
  selector: '[scheduleResize]'
})
export class ScheduleResizeDirective {

  originalValue: number;
  startDragPosition: number;
  previousPosition: number;
  currentValue: number;
  draggingProperty: string;
  
  constructor(private el: ElementRef) { }

  @HostListener('mousedown', ['$event'])
  onDragStart(event: DragEvent) {

    this.draggingProperty = this.propertyHandler(event)

    if (!this.draggingProperty) return;

    this.originalValue = parseFloat(this.el.nativeElement.style[this.draggingProperty]);
    this.startDragPosition = event.clientY;
    this.previousPosition = this.startDragPosition;
    this.currentValue = parseFloat(this.el.nativeElement.style[this.draggingProperty])

    console.log(`Start dragging session`)
    console.log(`Initial ${this.draggingProperty} value: ${this.originalValue}`)
    console.log(`Start dragging position: ${this.startDragPosition}`)

    const takeOptions = () => this.startDragPosition !== null && this.startDragPosition !== undefined;

    // Subscribe to mouse movements only during dragging session
    fromEvent(document, 'mousemove')
    .pipe(takeWhile(takeOptions))
    .subscribe((event: MouseEvent) => this.onDrag(event));

    // Subscribe to mouse up only during dragging session
    fromEvent(document, 'mouseup')
    .pipe(takeWhile(takeOptions))
    .subscribe(_ => this.onDragEnd());

  }

  private onDrag(event: MouseEvent) {

    if (this.startDragPosition == undefined || this.startDragPosition == null) return;
    
    if (event.clientY === this.previousPosition) return;

    if (!this.draggingProperty) return;
    
    console.log(`Previous position: ${this.previousPosition}`)
    console.log(`New drag position: ${event.clientY}`)
    
    const offset = event.clientY - this.previousPosition;

    console.log(`Offset: ${offset}`)

    this.updateSizeFromOffset(this.draggingProperty, offset);

    this.previousPosition = event.clientY;

  }

  private updateSizeFromOffset(property, offset){

    if (offset === 0) return;

    const height = parseFloat(this.el.nativeElement.style.height);

    // Minimum size for schedule
    if (property === 'height' && height + offset <= 45) return;
    if (property === 'top' && height - offset <= 45) return;

    // Prevent out of bound schedules
    if (property === 'top' && this.currentValue + offset <= 0) return;
    // if (property === 'height' && this.previousPosition + offset >= 420) return;

    console.log(`Current ${property}: ${this.currentValue}`)
    console.log(`Update ${property} to: ${this.currentValue + offset}px`)
    
    this.el.nativeElement.style[property] = `${this.currentValue + offset}px`;

    if (property === 'top') {
      this.el.nativeElement.style.height = `${height - offset}px`;
    }

    this.currentValue = parseFloat(this.el.nativeElement.style[property])
  }

  private onDragEnd() {

    console.log(`Dragging finished`)
    console.log(`Updated property: ${this.draggingProperty}`)
    console.log(`Original position: ${this.startDragPosition}`)
    console.log(`Final position: ${this.previousPosition}`)

    if (this.draggingProperty === 'height') {
      console.log(`Hours added / removed: ${(this.previousPosition - this.startDragPosition) / 70}`)
    }

    if (this.draggingProperty === 'top') {
      console.log(`Hours added / removed: ${((this.previousPosition - this.startDragPosition) / 70) * -1}`)
    }

    this.originalValue = null;
    this.startDragPosition = null;
    this.previousPosition = null;
    this.currentValue = null;
    this.draggingProperty = null;

  }

  private propertyHandler(event){

    if (!event || !event.target || !(event.target as any).id) return null;

    switch ((event.target as any).id) {
      case 'top-resize': return 'top';
      case 'bottom-resize': return 'height';
      default: return null;
    }

  }

}
