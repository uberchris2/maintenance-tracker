import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Maintenance } from '../models/maintenance';
import { DefaultHttpOptions } from '../default-http-options';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(private http: HttpClient) { }

  post(maintenance: Maintenance) {
    return this.http.post<Maintenance>('api/maintenance', maintenance, DefaultHttpOptions);
  }

  delete(id: string) {
    return this.http.delete(`api/maintenance/${id}`);
  }
}
