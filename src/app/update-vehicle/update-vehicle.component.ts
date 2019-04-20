import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { MaintenanceService } from '../services/maintenance.service';
import { Vehicle } from '../models/vehicle';

@Component({
  selector: 'app-update-vehicle',
  templateUrl: './update-vehicle.component.html',
  styleUrls: ['./update-vehicle.component.css']
})
export class UpdateVehicleComponent implements OnInit {

  vehicle: Vehicle;

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['vehicleId']).subscribe(vehicle => {
        this.vehicle = vehicle;
      });
    });
  }

  submit() {
    this.vehicleService.put(this.vehicle)
      .subscribe(response => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle.id}`);
      });
  }

}
