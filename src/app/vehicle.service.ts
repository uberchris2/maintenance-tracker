import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehicle } from './vehicle';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
    return this.http.post<Vehicle>('api/vehicles', vehicle, httpOptions);
  }
}
