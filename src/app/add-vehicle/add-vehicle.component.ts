import { Component, OnInit, inject } from '@angular/core';
import { YearMakeModelService, Make } from '../services/year-make-model.service';
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
export class AddVehicleComponent implements OnInit {

  years: number[] | undefined;
  makes: Make[] | undefined;
  models: string[] | undefined;

  year: number | undefined;
  make: Make | undefined;
  model: string | undefined;
  name = '';
  mileage: number | undefined;

  private yearMakeModelService = inject(YearMakeModelService);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  ngOnInit() {
    this.yearMakeModelService.getYears().subscribe(years => this.years = years);
  }

  yearSelected() {
    this.makes = undefined;
    this.models = undefined;
    this.make = undefined;
    this.model = undefined;
    this.name = '';
    if (this.year) {
      this.yearMakeModelService.getMakes(this.year).subscribe(makes => this.makes = makes);
    }
  }

  makeSelected() {
    this.models = undefined;
    this.model = undefined;
    this.name = '';
    if (this.make) {
      this.yearMakeModelService.getModels(this.year!, this.make.make_id).subscribe(models => this.models = models);
    }
  }

  modelSelected() {
    if (this.model) {
      this.name = `${this.year} ${this.make!.make_display} ${this.model}`;
    } else {
      this.name = '';
    }
  }

  add() {
    const newVehicle: Vehicle = {
      year: this.year!,
      make: this.make!.make_display,
      model: this.model!,
      name: this.name,
      mileage: this.mileage!,
      shared: false
    };
    this.vehicleService.put(newVehicle)
      .subscribe(response => {
        this.router.navigateByUrl('/fleet');
      });
  }

}
