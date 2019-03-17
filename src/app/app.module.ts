import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SchedulePositionDirective } from './@shared/directives/schedule-position-directive/schedule-position.directive';
import { ScheduleResizeDirective } from './@shared/directives/schedule-resize-directive/schedule-resize.directive';
import { MemoizePipe } from './@shared/pipes/memoize-pipe/memoize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    SchedulePositionDirective,
    ScheduleResizeDirective,
    MemoizePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
