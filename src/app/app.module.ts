import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SchedulePositionDirective } from './schedule-position-directive/schedule-position.directive';
import { ScheduleResizeDirective } from './schedule-resize-directive/schedule-resize.directive';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SchedulePositionDirective,
    ScheduleResizeDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
