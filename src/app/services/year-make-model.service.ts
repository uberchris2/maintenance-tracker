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
    return this.http.get<{ Years: { max_year: number; min_year: number } }>('yearmakemodel/year')
      .pipe(map(
        (response) => {
          const list: number[] = [];
          for (let i = response.Years.max_year; i >= response.Years.min_year; i--) {
            list.push(i);
          }
          return list;
        }));
  }

  getMakes(year: number): Observable<Make[]> {
    return this.http.get<{ Makes: Make[] }>(`yearmakemodel/make?year=${year}`)
      .pipe(map(
        (response) => {
          return response.Makes;
        }));
  }

  getModels(year: number, make_id: string): Observable<string[]> {
    return this.http.get<{ Models: { model_name: string }[] }>(`yearmakemodel/model?year=${year}&make=${make_id}`)
      .pipe(map(
        (response) => {
          return response.Models.map(model => model.model_name);
        }));
  }
}

export interface Make {
  make_id: string;
  make_display: string;
}
