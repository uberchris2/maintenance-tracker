import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Maintenance } from '../models/maintenance';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  private http = inject(HttpClient);

  put(maintenance: Maintenance) {
    return this.http.put<Maintenance>('api/maintenance', maintenance);
  }

  delete(id: string) {
    return this.http.delete(`api/maintenance/${id}`);
  }

  get(id: string): Observable<Maintenance> {
    return this.http.get<Maintenance>(`api/maintenance/${id}`)
  }
}
