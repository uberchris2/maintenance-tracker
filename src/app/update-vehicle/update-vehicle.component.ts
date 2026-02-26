import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-update-vehicle',
    templateUrl: './update-vehicle.component.html',
    styleUrl: './update-vehicle.component.css',
    imports: [RouterLink, FormsModule]
})
export class UpdateVehicleComponent implements OnInit {

  vehicle: Vehicle | undefined;

  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['vehicleId']).subscribe(vehicle => {
        this.vehicle = vehicle;
      });
    });
  }

  submit() {
    this.vehicleService.put(this.vehicle!)
      .subscribe(() => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle!.id}`);
      });
  }

}
