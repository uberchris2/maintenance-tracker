import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../vehicle';
import { ActivatedRoute } from '@angular/router';
import { Maintenance } from '../maintenance';
import { MaintenanceService } from '../maintenance.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicle: Vehicle;
  allMaintenance: Maintenance[];

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute, private maintenanceService: MaintenanceService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['id']).subscribe(vehicle => this.vehicle = vehicle);
      this.maintenanceService.getAll(params['id']).subscribe(allMaintenance => this.allMaintenance = allMaintenance);
    });
  }
}
