import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { MaintenanceService } from '../services/maintenance.service';
import { VehicleMaintenance } from '../models/vehicle-maintenance';
import { addMonths } from 'date-fns';
import { ReceiptService } from '../services/receipt.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  vehicleMaintenance: VehicleMaintenance;
  today = new Date();

  constructor(private vehicleService: VehicleService, private route: ActivatedRoute, 
    private maintenanceService: MaintenanceService, private receiptService: ReceiptService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.getWithMaintenance(params['id']).subscribe(vehicleMaintenance => {
        this.prepareMaintenance(vehicleMaintenance);
        this.vehicleMaintenance = vehicleMaintenance;
      });
    });
  }

  delete(id: string) {
    this.maintenanceService.delete(id).subscribe(() => {
      this.vehicleMaintenance.maintenance = this.vehicleMaintenance.maintenance.filter(m => m.id !== id);
    });
  }

  downloadReceipt(name: string) {
    this.receiptService.download(name);
  }

  private prepareMaintenance(vehicleMaintenance: VehicleMaintenance) {
    //this function relies on the server sorting by most recent
    var completedItems = [];
    for (let m of vehicleMaintenance.maintenance) {
      if (!completedItems.includes(m.item)) {
        completedItems.push(m.item);
        if (m.intervalMonths) {
          m.dueDate = addMonths(m.date, m.intervalMonths);
        }
        if (m.intervalMileage) {
          m.dueMileage = m.mileage + m.intervalMileage;
        }
      }
    }
  }
}
