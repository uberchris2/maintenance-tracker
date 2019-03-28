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
    return this.http.get('yearmakemodel/year')
      .pipe(map(
        (response: any) => {
          var list = [];
          for (var i = response.Years.max_year; i >= response.Years.min_year; i--) {
            list.push(i);
          }
          return list;
        }));
  }

  getMakes(year: number): Observable<Make[]> {
    return this.http.get(`yearmakemodel/make?year=${year}`)
      .pipe(map(
        (response: any) => {
          return response.Makes;
        }));
  }

  getModels(year: number, make_id: string): Observable<string[]> {
    return this.http.get(`yearmakemodel/model?year=${year}&make=${make_id}`)
      .pipe(map(
        (response: any) => {
          return response.Models.map(model => model.model_name);
        }));
  }
}

export class Make {
  make_id: string;
  make_display: string;
}