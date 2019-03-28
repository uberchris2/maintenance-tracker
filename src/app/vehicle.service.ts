import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehicle } from './vehicle';
import { Observable } from 'rxjs';
import { DefaultHttpOptions } from './default-http-options';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('api/vehicles');
  }

  get(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`api/vehicles/${id}`);
  }

  post(vehicle: Vehicle) {
    return this.http.post<Vehicle>('api/vehicles', vehicle, DefaultHttpOptions);
  }
}