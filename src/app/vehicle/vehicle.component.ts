import { Component, OnInit, inject } from '@angular/core';
import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MaintenanceService } from '../services/maintenance.service';
import { VehicleMaintenance } from '../models/vehicle-maintenance';
import { addMonths } from 'date-fns';
import { ReceiptService } from '../services/receipt.service';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { faPen, faPlus, faReceipt, faStickyNote, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrl: './vehicle.component.css',
    imports: [RouterLink, FaIconComponent, NgbPopover, DecimalPipe, DatePipe]
})
export class VehicleComponent implements OnInit {

  vehicleMaintenance: VehicleMaintenance | undefined;
  today = new Date();
  faPen = faPen;
  faPlus = faPlus;
  faReceipt = faReceipt;
  faStickyNote = faStickyNote;
  faEdit = faEdit;
  faTrash = faTrash;

  private vehicleService = inject(VehicleService);
  private route = inject(ActivatedRoute);
  private maintenanceService = inject(MaintenanceService);
  private receiptService = inject(ReceiptService);
  private modalService = inject(NgbModal);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.getWithMaintenance(params['id']).subscribe(vehicleMaintenance => {
        this.prepareMaintenance(vehicleMaintenance);
        this.vehicleMaintenance = vehicleMaintenance;
      });
    });
  }

  delete(id: string) {
    this.modalService.open(ConfirmDeleteModalComponent).result.then((response) => {
      this.maintenanceService.delete(id).subscribe(() => {
        this.vehicleMaintenance!.maintenance = this.vehicleMaintenance!.maintenance.filter(m => m.id !== id);
      });
    }, (dismissal) => {});
  }

  downloadReceipt(name: string) {
    this.receiptService.download(name).subscribe(authorization => window.open(authorization.url, '_blank'));
  }

  private prepareMaintenance(vehicleMaintenance: VehicleMaintenance) {
    //this function relies on the server sorting by most recent
    const completedItems: string[] = [];
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
