import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as moment from "moment";
import { DayType } from '../types/day.type';
import { CalendarMode } from '../enums/calendar-mode.enum';
import { ScheduleType } from '../types/schedule.type';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  pointer: Date;
  mode: CalendarMode;

  days: DayType[];
  schedules: ScheduleType[];
  hours: string[];

  stickyMenu: boolean;

  private _isAlive = true;

  constructor() { }

  ngOnInit() {
    this.initializeData();
  }

  ngAfterViewInit() {
    this.subscribeToScroll();
  }

  ngOnDestroy(){
    this._isAlive = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {

    // TODO: Must optimize resize trigger rate

    let prevMode = this.mode;
    this.mode = window.innerWidth > 800 ? CalendarMode.WEEK : CalendarMode.DAY;

    if (prevMode !== this.mode) {
      this.days = this.buildDaysForMode(this.mode)
    }

  }

  toggleMode() {

    if (window.innerWidth < 800) return;

    this.mode = this.mode === CalendarMode.WEEK ? CalendarMode.DAY : CalendarMode.WEEK;
    this.days = this.buildDaysForMode(this.mode)
  }

  private initializeData() {
    this.pointer = new Date();
    this.mode = window.innerWidth > 800 ? CalendarMode.WEEK : CalendarMode.DAY;
    this.hours = this.getHours();
    this.schedules = this.getSchedules();
    this.days = this.buildDaysForMode(this.mode);
  }

  private subscribeToScroll() {
    fromEvent(window, 'scroll')
      .pipe(
        takeWhile(_ => this._isAlive)
      )
      .subscribe(
        position => 
          this.updateScrollPosition(window.scrollY)
      );
  }

  private updateScrollPosition(position: number) {
    this.stickyMenu = position > 65
  }

  private buildDaysForMode(mode: CalendarMode) {

    switch (mode) {
      case 'DAY': return this.buildTodayDate();
      case 'WEEK': return this.buildCurrentWeek();
    }

  }

  private buildTodayDate() {
    let today = moment()
    return [{
      number: today.format('DD'),
      day: today.format('ddd')
    }]
  }

  private buildCurrentWeek() {

    const weekStarts = moment().startOf('isoWeek');
    const weekEnds = moment().endOf('isoWeek');

    let weekDays = [];
    let day = weekStarts;

    while (day <= weekEnds) {
      weekDays.push(day);
      day = day.clone().add(1, 'd');
    }

    return this.buildWeek(weekDays)

  }

  private buildWeek(weekDays: moment.Moment[]): DayType[] {

    let week = []

    weekDays.forEach(day => {
      week.push({
        number: day.format('DD'),
        day: day.format('ddd')
      })
    })

    return week

  }

  private getHours(start = 0, end = 23) {

    let hourList = []

    for (let hour = start; hour <= end; hour++) {

      if (hour >= 0 && hour <= 9) {
        hourList.push(`0${hour}:00`)
      } else {
        hourList.push(`${hour}:00`)
      }

    }

    return hourList
  }

  // Static schedules, just for testing
  private getSchedules() {
    return [{
      name: 'Hello',
      time: {
        start: new Date(2019, 2, 16, 13, 0),
        end: new Date(2019, 2, 16, 14, 0)
      }

    }, {
      name: 'Hello',
      time: {
        start: new Date(2019, 2, 16, 1, 0),
        end: new Date(2019, 2, 16, 2, 0)
      }
    }]
  }
  
}