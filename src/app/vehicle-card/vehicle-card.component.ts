import { Component, OnInit, Input } from '@angular/core';
import { Vehicle } from '../vehicle';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css']
})
export class VehicleCardComponent implements OnInit {

  @Input() vehicle: Vehicle;
  deleted = false;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
  }

  delete(event) {
    event.stopPropagation();
    this.vehicleService.delete(this.vehicle.id).subscribe(() => this.deleted = true);
  }

}
