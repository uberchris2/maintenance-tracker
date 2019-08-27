import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-overwrite-receipt-modal',
  templateUrl: './overwrite-receipt-modal.component.html',
  styleUrls: ['./overwrite-receipt-modal.component.css']
})
export class OverwriteReceiptModalComponent {

  constructor(public activeModal: NgbActiveModal) { }

}
