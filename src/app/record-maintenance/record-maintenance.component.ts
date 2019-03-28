import { Component, OnInit } from '@angular/core';
import { Maintenance } from '../Maintenance';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../vehicle';
import { VehicleService } from '../vehicle.service';
import { MaintenanceService } from '../maintenance.service';

@Component({
  selector: 'app-record-maintenance',
  templateUrl: './record-maintenance.component.html',
  styleUrls: ['./record-maintenance.component.css']
})
export class RecordMaintenanceComponent implements OnInit {

  vehicle: Vehicle;
  maintenance = new Maintenance();

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService, private maintenanceService: MaintenanceService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['vehicleId']).subscribe(vehicle => {
        this.vehicle = vehicle;
        this.maintenance.vehicle = vehicle.id;
      });
    });
  }

  add() {
    this.maintenanceService.post(this.maintenance)
      .subscribe(response => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle.id}`);
      });
  }

  addAndContinue() {
    this.maintenanceService.post(this.maintenance)
      .subscribe(response => {
        this.maintenance.item = "";
        this.maintenance.notes = "";
      });
  }

}
