import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../services/maintenance.service';
import { VehicleMaintenance } from '../models/vehicle-maintenance';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicleMaintenance: VehicleMaintenance;

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.getWithMaintenance(params['id']).subscribe(vehicleMaintenance => this.vehicleMaintenance = vehicleMaintenance);
    });
  }

  delete(id: string) {
    this.maintenanceService.delete(id).subscribe(() => {
      this.vehicleMaintenance.maintenance = this.vehicleMaintenance.maintenance.filter(m => m.id !== id);
    });
  }

  downloadReceipt(name: string) {
    this.maintenanceService.downloadReceipt(name);
  }
}
