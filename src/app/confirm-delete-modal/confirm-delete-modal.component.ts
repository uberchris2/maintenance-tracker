import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-delete-modal',
    templateUrl: './confirm-delete-modal.component.html',
    styleUrl: './confirm-delete-modal.component.css'
})
export class ConfirmDeleteModalComponent {

  activeModal = inject(NgbActiveModal);

}
