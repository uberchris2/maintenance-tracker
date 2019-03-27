import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YearMakeModelService {

  constructor(private http: HttpClient) { }

  getYears(): Observable<number[]> {
    return this.http.get('https://maintenance-tracker-api.azurewebsites.net/yearmakemodel/year')
      .pipe(map(
        (response: any) => {
          var list = [];
          for (var i = response.Years.max_year; i >= response.Years.min_year; i--) {
            list.push(i);
          }
          return list;
        }));
  }
}
