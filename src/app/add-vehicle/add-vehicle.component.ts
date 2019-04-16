import { Component, OnInit } from '@angular/core';
import { YearMakeModelService, Make } from '../year-make-model.service';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../vehicle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  years: number[];
  makes: Make[];
  models: string[];

  year: number;
  make: Make;
  model: string;
  name = '';

  constructor(private yearMakeModelService: YearMakeModelService, private vehicleService: VehicleService, private router: Router) { }

  ngOnInit() {
    this.yearMakeModelService.getYears().subscribe(years => this.years = years);
  }

  yearSelected() {
    this.makes = null;
    this.models = null;
    this.make = null;
    this.model = null;
    this.name = '';
    if (this.year) {
      this.yearMakeModelService.getMakes(this.year).subscribe(makes => this.makes = makes);
    }
  }

  makeSelected() {
    this.models = null;
    this.model = null;
    this.name = '';
    if (this.make) {
      this.yearMakeModelService.getModels(this.year, this.make.make_id).subscribe(models => this.models = models);
    }
  }

  modelSelected() {
    if (this.model) {
      this.name = `${this.year} ${this.make.make_display} ${this.model}`;
    } else {
      this.name = '';
    }
  }

  add() {
    const newVehicle = new Vehicle();
    newVehicle.year = this.year;
    newVehicle.make = this.make.make_display;
    newVehicle.model = this.model;
    newVehicle.name = this.name;
    this.vehicleService.post(newVehicle)
      .subscribe(response => {
        this.router.navigateByUrl('/fleet');
      });
  }

}
