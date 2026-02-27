import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';
import { VehicleMaintenance } from '../models/vehicle-maintenance';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private http = inject(HttpClient);

  getAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('api/vehicles');
  }

  get(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`api/vehicles/${id}`);
  }

  getWithMaintenance(id: string): Observable<VehicleMaintenance> {
    return this.http.get<VehicleMaintenance>(`api/vehiclemaintenance/${id}`);
  }

  getWithMaintenanceShared(id: string): Observable<VehicleMaintenance> {
    return this.http.get<VehicleMaintenance>(`${environment.publicApiEndpoint}api/vehiclemaintenance/${id}`);
  }

  put(vehicle: Vehicle) {
    return this.http.put<Vehicle>('api/vehicles', vehicle);
  }

  delete(id: string) {
    return this.http.delete(`api/vehicles/${id}`);
  }
}
