import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../vehicle.service';
import { Vehicle } from '../vehicle';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicle: Vehicle;

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['id']).subscribe(vehicle => this.vehicle = vehicle);
    });
  }
}
