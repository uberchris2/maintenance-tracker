import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-overwrite-receipt-modal',
    templateUrl: './overwrite-receipt-modal.component.html',
    styleUrl: './overwrite-receipt-modal.component.css'
})
export class OverwriteReceiptModalComponent {

  activeModal = inject(NgbActiveModal);

}
