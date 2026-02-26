import { Component, inject } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/vehicle';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-add-vehicle',
    templateUrl: './add-vehicle.component.html',
    styleUrl: './add-vehicle.component.css',
    imports: [RouterLink, FormsModule]
})
export class AddVehicleComponent {

  year: number | undefined;
  make = '';
  model = '';
  name = '';
  mileage: number | undefined;
  vin = '';

  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  updateName() {
    this.name = `${this.year || ''} ${this.make} ${this.model}`;
  }

  add() {
    const newVehicle: Vehicle = {
      year: this.year!,
      make: this.make,
      model: this.model,
      name: this.name,
      mileage: this.mileage!,
      shared: false,
      vin: this.vin || undefined
    };
    this.vehicleService.put(newVehicle)
      .subscribe(response => {
        this.router.navigateByUrl('/fleet');
      });
  }

}
