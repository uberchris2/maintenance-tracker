import { Component, OnInit, ViewChild } from '@angular/core';
import { Maintenance } from '../models/maintenance';
import { ActivatedRoute, Router } from '@angular/router';
import { Vehicle } from '../models/vehicle';
import { VehicleService } from '../services/vehicle.service';
import { MaintenanceService } from '../services/maintenance.service';
import { UploadStatus, UploadStatusType } from '../models/upload-status';
import { ReceiptService } from '../services/receipt.service';

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

  constructor(private route: ActivatedRoute, private vehicleService: VehicleService, 
    private maintenanceService: MaintenanceService, private router: Router,
    private receiptService: ReceiptService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleService.get(params['vehicleId']).subscribe(vehicle => {
        this.vehicle = vehicle;
        this.maintenance.vehicleId = vehicle.id;
      });
    });
    this.receiptService.getAll().subscribe(receipts => this.receipts = receipts);
  }

  add() {
    this.maintenanceService.post(this.maintenance)
      .subscribe(response => {
        this.router.navigateByUrl(`/vehicle/${this.vehicle.id}`);
      });
  }

  addAndContinue() {
    this.maintenanceService.post(this.maintenance)
      .subscribe(response => {
        this.maintenance.item = '';
        this.maintenance.notes = '';
      });
  }

  openReceiptDialog() {
    this.receiptInput.nativeElement.click();
  }

  newReceiptSelected(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
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
  }

  existingReceiptSelected(receipt: string) {
    this.maintenance.receipt = receipt;
  }

  removeReceipt() {
    this.maintenance.receipt = null;
  }
}
