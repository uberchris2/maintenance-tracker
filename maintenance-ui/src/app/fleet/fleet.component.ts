import { Component, OnInit } from '@angular/core';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-fleet',
  templateUrl: './fleet.component.html',
  styleUrls: ['./fleet.component.css']
})
export class FleetComponent implements OnInit {
  vehicles: Vehicle[];
  
  constructor() {
    this.vehicles = [new Vehicle(), new Vehicle(), new Vehicle(), new Vehicle(), new Vehicle()];
    this.vehicles[0].id = 1;
    this.vehicles[0].year = 1992;
    this.vehicles[0].make = 'Chevrolet';
    this.vehicles[0].model = 'Corsica';
    this.vehicles[1].id = 2;
    this.vehicles[1].year = 1996;
    this.vehicles[1].make = 'Isuzu';
    this.vehicles[1].model = 'Trooper';
    this.vehicles[2].id = 3;
    this.vehicles[2].year = 1998;
    this.vehicles[2].make = 'Ford';
    this.vehicles[2].model = 'Escort ZX2';
    this.vehicles[3].id = 4;
    this.vehicles[3].year = 1992;
    this.vehicles[3].make = 'BMW';
    this.vehicles[3].model = '325i';
    this.vehicles[4].id = 5;
    this.vehicles[4].year = 2005;
    this.vehicles[4].make = 'BMW';
    this.vehicles[4].model = 'M3';
  }

  ngOnInit() {
  }

}
