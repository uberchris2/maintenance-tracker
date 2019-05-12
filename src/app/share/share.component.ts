import { Component, OnInit } from '@angular/core';
import { VehicleMaintenance } from '../models/vehicle-maintenance';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  vehicleMaintenance: VehicleMaintenance;
  
  constructor(private vehicleService: VehicleService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.getWithMaintenanceShared(params['vehicleId']).subscribe(vehicleMaintenance => {
        this.vehicleMaintenance = vehicleMaintenance;
      });
    });
  }

}
