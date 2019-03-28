import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})
export class FleetComponent implements OnInit {
  vehicles: Vehicle[];
  
  constructor(private vehicleService: VehicleService) {  }

  ngOnInit() {
    this.vehicleService.getAll().subscribe(vehicles => this.vehicles = vehicles);
  }

}
