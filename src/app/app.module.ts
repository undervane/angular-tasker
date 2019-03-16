import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SchedulePositionDirective } from './schedule-position-directive/schedule-position.directive';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SchedulePositionDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
