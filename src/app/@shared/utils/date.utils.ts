import * as moment from 'moment';

  export function buildWeekFromDate(date: Date = new Date()) {

    const weekStarts = moment(date).startOf('isoWeek');
    const weekEnds = moment(date).endOf('isoWeek');

    let weekDays = [];
    let day = weekStarts;

    while (day <= weekEnds) {
      weekDays.push(day.toDate());
      day = day.clone().add(1, 'd');
    }

    return weekDays;

  }

  export function getHours(start = 0, end = 23) {

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