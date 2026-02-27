import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Maintenance } from '../models/maintenance';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleMaintenance } from '../models/vehicle-maintenance';
import { VehicleService } from '../services/vehicle.service';
import { MaintenanceService } from '../services/maintenance.service';
import { UploadStatus, UploadStatusType } from '../models/upload-status';
import { ReceiptService } from '../services/receipt.service';
import { NgbModal, NgbTypeahead, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { OverwriteReceiptModalComponent } from '../overwrite-receipt-modal/overwrite-receipt-modal.component';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-record-maintenance',
    templateUrl: './record-maintenance.component.html',
    styleUrl: './record-maintenance.component.css',
    imports: [RouterLink, FormsModule, NgbTypeahead, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownButtonItem, NgbDropdownItem, NgbProgressbar, DatePipe]
})
export class RecordMaintenanceComponent implements OnInit {
  @ViewChild('receiptInput', { static: true }) receiptInput!: ElementRef<HTMLInputElement>;

  vehicle: VehicleMaintenance | undefined;
  maintenance: Maintenance = { item: '', date: new Date(), notes: '', receipt: '' };
  uploading = false;
  uploadProgress = 0;
  receipts: Array<string> | undefined;
  previousSuccess = false;

  private defaultItemOptions = ['Engine oil', 'Air filter', 'Fuel filter', 'Tires replaced', 'Tires rotated',
  'Cabin air filter', 'Spark plugs', 'Ignition coils', 'Brake fluid', 'Brake pads', 'Brake pads and rotors',
  'Power steering fluid', 'Transmission fluid', 'Timing belt', 'Coolant', 'Windshield wipers', 'Battery',
  'Alternator', 'Valve adjustment'];
  itemOptions: string[] = this.defaultItemOptions;
  maintenanceItemTypeahead = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.itemOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  private route = inject(ActivatedRoute);
  private vehicleService = inject(VehicleService);
  private maintenanceService = inject(MaintenanceService);
  private router = inject(Router);
  private receiptService = inject(ReceiptService);
  private modalService = inject(NgbModal);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.getWithMaintenance(params['vehicleId']).subscribe(vm => {
        this.vehicle = vm;
        this.maintenance.vehicleId = vm.id;
        const previousItems = [...new Set(vm.maintenance.map(m => m.item))];
        const defaultLower = new Set(this.defaultItemOptions.map(i => i.toLowerCase()));
        const uniquePrevious = previousItems.filter(i => !defaultLower.has(i.toLowerCase()));
        this.itemOptions = [...uniquePrevious, ...this.defaultItemOptions];
      });
      if ('maintenanceId' in params) {
        this.maintenanceService.get(params.maintenanceId).subscribe(maintenance => {
          maintenance.intervalMonths = maintenance.intervalMonths || undefined;
          maintenance.intervalMileage = maintenance.intervalMileage || undefined;
          this.maintenance = maintenance;
        })
      }
    });
    this.receiptService.getAll().subscribe(receipts => this.receipts = receipts);
  }

  add() {
    this.maintenanceService.put(this.maintenance)
      .subscribe(response => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle!.id}`);
      });
  }

  addAndContinue() {
    this.maintenanceService.put(this.maintenance)
      .subscribe(response => {
        this.maintenance.item = '';
        this.maintenance.notes = '';
        this.previousSuccess = true;
      });
  }

  openReceiptDialog() {
    this.receiptInput.nativeElement.click();
  }

  newReceiptSelected(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (this.receipts?.includes(file.name)) {
        this.modalService.open(OverwriteReceiptModalComponent).result.then((response) => {
          this.uploadReceipt(file);
        }, (dismissal) => {});
      } else {
        this.uploadReceipt(file);
      }
    }
  }

  private uploadReceipt(file) {
    this.uploading = true;
    this.uploadProgress = 0;
    this.receiptService.uploadReceipt(file).subscribe((x: UploadStatus) => {
      this.uploadProgress = x.percentComplete;
      if (x.type === UploadStatusType.Completion) {
        this.uploading = false;
        this.maintenance.receipt = file.name;
      }
    });
  }

  existingReceiptSelected(receipt: string) {
    this.maintenance.receipt = receipt;
  }

  removeReceipt() {
    this.maintenance.receipt = '';
  }

  dismissSuccess() {
    this.previousSuccess = false;
  }
}
