import { Component, Input, inject } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrash, faShare } from '@fortawesome/free-solid-svg-icons';

import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-vehicle-card',
    templateUrl: './vehicle-card.component.html',
    styleUrl: './vehicle-card.component.css',
    imports: [RouterLink, FaIconComponent]
})
export class VehicleCardComponent {

  private vehicleService = inject(VehicleService);
  private modalService = inject(NgbModal);

  @Input({ required: true }) vehicle!: Vehicle;
  deleted = false;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faShare = faShare;

  delete(event) {
    event.stopPropagation();
    this.modalService.open(ConfirmDeleteModalComponent).result.then((response) => {
      this.vehicleService.delete(this.vehicle.id!).subscribe(() => this.deleted = true);
    }, (dismissal) => {});
  }

}
