import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-fleet',
    templateUrl: './fleet.component.html',
    styleUrls: ['./fleet.component.css'],
    imports: [VehicleCardComponent, RouterLink, FaIconComponent]
})
export class FleetComponent implements OnInit {
  vehicles: Vehicle[];
  faPlus = faPlus;

  constructor(private vehicleService: VehicleService) {  }

  ngOnInit() {
    this.vehicleService.getAll().subscribe(vehicles => this.vehicles = vehicles);
  }

}
