import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';
import { DefaultHttpOptions } from '../default-http-options';
import { VehicleMaintenance } from '../models/vehicle-maintenance';

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

  getWithMaintenance(id: string): Observable<VehicleMaintenance> {
    return this.http.get<VehicleMaintenance>(`api/vehiclemaintenance/${id}`);
  }

  post(vehicle: Vehicle) {
    return this.http.post<Vehicle>('api/vehicles', vehicle, DefaultHttpOptions);
  }

  delete(id: string) {
    return this.http.delete(`api/vehicle/${id}`);
  }
}
