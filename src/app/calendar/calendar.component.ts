import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile, take } from 'rxjs/operators';
import { CalendarMode } from '../@models/enums/calendar-mode.enum';
import { DayType } from '../@models/types/day.type';
import { ScheduleType } from '../@models/types/schedule.type';
import { getStaticSchedules } from '../@models/static/schedules.static';
import { AbalinService } from '../services/abalin/abalin.service';
import { buildWeekFromDate, getHours } from '../@shared/utils/date.utils';
import { NameDaysType } from '../@models/types/name-days.type';
import { ScheduleListType } from '../@models/types/schedule-list.type';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  pointer: Date;
  mode: CalendarMode;

  days: DayType[];
  data: ScheduleListType;
  hours: string[];

  stickyMenu: boolean;

  private _isAlive = true;

  constructor(
    private readonly _abalinService: AbalinService
  ) { }

  ngOnInit(): void {
    this.initializeData();
    this.fetchData();
  }

  ngAfterViewInit(): void {
    this.subscribeToScroll();
  }

  ngOnDestroy(): void{
    this._isAlive = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {

    // TODO: Must optimize resize trigger rate

    let prevMode = this.mode;
    this.mode = window.innerWidth > 800 ? CalendarMode.WEEK : CalendarMode.DAY;

    if (prevMode !== this.mode) {
      this.days = this.buildDaysForMode(this.mode)
    }

  }

  getEventsForDay(day: DayType, schedules: ScheduleType[]): ScheduleType[] {

    day.date.setHours(23);

    let dayString = day.date.toISOString().slice(0, 10);
    
    return schedules && schedules[dayString] ? schedules[dayString].events : null;

  }

  getSchedulesForDay(day: DayType, schedules: ScheduleType[]): ScheduleType[] {
        
    day.date.setHours(23);

    let dayString = day.date.toISOString().slice(0, 10);
    
    return schedules && schedules[dayString] ? schedules[dayString].schedules : null;
  }

  private initializeData(): void {
    this.pointer = new Date();
    this.mode = window.innerWidth > 800 ? CalendarMode.WEEK : CalendarMode.DAY;
    this.data = getStaticSchedules();
    this.hours = getHours();
    this.days = this.buildDaysForMode(this.mode);
  }

  private fetchData(): void{
    this._abalinService.getNameDaysForWeek(new Date(), 'es').pipe(take(1)).subscribe(data => this.buildNameDaysEvents(data));
  }

  private subscribeToScroll(): void {
    fromEvent(window, 'scroll')
      .pipe(
        takeWhile(_ => this._isAlive)
      )
      .subscribe(
        position => 
          this.updateScrollPosition(window.scrollY)
      );
  }

  private updateScrollPosition(position: number): void {
    this.stickyMenu = position > 58
  }

  private buildDaysForMode(mode: CalendarMode): DayType[] {

    switch (mode) {
      case 'DAY': return this.buildTodayDate();
      case 'WEEK': return this.buildWeek();
    }

  }

  private buildTodayDate(): DayType[] {
    return [{
      date: new Date()
    }]
  }

  private buildWeek(): DayType[] {

    let week = [];

    let weekDays = buildWeekFromDate()

    weekDays.forEach(day => {
      week.push({
        date: day,
        event: {
          name: 'Evento',
          icon: 'fa-birthday-cake'
        }
      })
    })

    return week;
  }

  // Method below is just for demonstration purposes
  private buildNameDaysEvents(names: NameDaysType[]): void {
    
    names.forEach(day => {

      if (!day.data.name_es) return;
      
      let currentYear = new Date().getUTCFullYear();

      let stringMonth = day.data.month.toString().length === 1 ? '0' + day.data.month : day.data.month.toString();
      let stringDay = day.data.day.toString().length === 1 ? '0' + day.data.day : day.data.day.toString();

      const dateKey = `${currentYear}-${stringMonth}-${stringDay}`;

      if (!this.data) return;

      if (!this.data[dateKey]) {
        this.data[dateKey] = {events: [], schedules: []};
      }

      if (!this.data[dateKey].events) {
        this.data[dateKey].events = [];
      }

      let dayNameEvent = {
        name: `Saint ${day.data.name_es.split(',')[0]}`,
        icon: 'fa-crown',
        description: '',
        allDay: true
      }

      this.data[dateKey].events.push(dayNameEvent);

    })
  }

}