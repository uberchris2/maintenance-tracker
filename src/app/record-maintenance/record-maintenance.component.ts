import { Component, OnInit, ViewChild } from '@angular/core';
import { Maintenance } from '../models/maintenance';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { MaintenanceService } from '../services/maintenance.service';
import { UploadStatus, UploadStatusType } from '../models/upload-status';
import { ReceiptService } from '../services/receipt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OverwriteReceiptModalComponent } from '../overwrite-receipt-modal/overwrite-receipt-modal.component';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-record-maintenance',
  templateUrl: './record-maintenance.component.html',
  styleUrls: ['./record-maintenance.component.css']
})
export class RecordMaintenanceComponent implements OnInit {
  @ViewChild('receiptInput') receiptInput;

  vehicle: Vehicle;
  maintenance = new Maintenance();
  uploading = false;
  uploadProgress = 0;
  receipts: Array<string>;
  previousSuccess = false;

  defaultItemOptions = ['Engine oil', 'Air filter', 'Fuel filter', 'Tires replaced', 'Tires rotated', 
  'Cabin air filter', 'Spark plugs', 'Ignition coils', 'Brake fluid', 'Brake pads', 'Brake pads and rotors', 
  'Power steering fluid', 'Transmission fluid', 'Timing belt', 'Coolant', 'Windshield wipers', 'Battery', 
  'Alternator', 'Valve adjustment'];
  maintenanceItemTypeahead = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.defaultItemOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService, 
    private maintenanceService: MaintenanceService, private router: Router,
    private receiptService: ReceiptService, private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['vehicleId']).subscribe(vehicle => {
        this.vehicle = vehicle;
        this.maintenance.vehicleId = vehicle.id;
      });
      if ('maintenanceId' in params) {
        this.maintenanceService.get(params.maintenanceId).subscribe(maintenance => {
          this.maintenance = maintenance;
        })
      }
    });
    this.receiptService.getAll().subscribe(receipts => this.receipts = receipts);
  }

  add() {
    this.maintenanceService.put(this.maintenance)
      .subscribe(response => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle.id}`);
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
      if (this.receipts.includes(file.name)) {
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
    this.maintenance.receipt = null;
  }

  dismissSuccess() {
    this.previousSuccess = false;
  }
}
