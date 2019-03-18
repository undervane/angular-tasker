import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { buildWeekFromDate } from 'src/app/@shared/utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class AbalinService {

  static API_PATH = 'https://cors.io/?https://api.abalin.net/get'
  static NAMEDAYS_API = '/namedays?'
    
  constructor
  (
    private readonly http: HttpClient
  ) 
  { }

  getNameDaysForDate(date: Date, country: string): Observable<any>{

    const path = AbalinService.API_PATH + AbalinService.NAMEDAYS_API;

    let params = {
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      country
    }

    return this.http.get(path, {params});
  }

  getNameDaysForWeek(date: Date, country: string){

    let requests = [];

    let week = buildWeekFromDate(date);

    week.forEach(day => 
      requests.push(this.getNameDaysForDate(day, country))
    );

    return forkJoin(requests);

  }

}
