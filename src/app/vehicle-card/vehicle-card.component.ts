import { Component, OnInit, Input } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrash, faShare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.css']
})
export class VehicleCardComponent implements OnInit {

  @Input() vehicle: Vehicle;
  deleted = false;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faShare = faShare;

  constructor(private vehicleService: VehicleService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  delete(event) {
    event.stopPropagation();
    this.modalService.open(ConfirmDeleteModalComponent).result.then((response) => {
      this.vehicleService.delete(this.vehicle.id).subscribe(() => this.deleted = true);
    }, (dismissal) => {});
  }

}
