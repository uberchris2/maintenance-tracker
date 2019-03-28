import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Maintenance } from './Maintenance';
import { DefaultHttpOptions } from './default-http-options';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private http: HttpClient) { }

  post(maintenance: Maintenance) {
    return this.http.post<Maintenance>('api/maintenance', maintenance, DefaultHttpOptions);
  }

  getAll(vehicleId: string): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`api/maintenance?vehicleId=${vehicleId}`);
  }
}
