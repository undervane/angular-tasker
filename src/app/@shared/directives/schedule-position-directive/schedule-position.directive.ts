import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[schedulePosition]'
})
export class SchedulePositionDirective {

  @Input()
  set schedulePosition(time) {
    this.updatePositionFromTime(time);
  }

  constructor(private el: ElementRef) {

  }

  updatePositionFromTime(time: {start: Date, end: Date}){

    // TODO: Missing minute render calculation

    const style = this.el.nativeElement.style

    const startHour = time.start.getHours();
    const startMinute = time.start.getMinutes();

    const endHour = time.end.getHours();
    const endMinute = time.end.getMinutes();

    style.top = `${startHour * 70.8}px`
    style.height = `${(endHour * 70.8) - startHour * 70.8}px`
  }

}
