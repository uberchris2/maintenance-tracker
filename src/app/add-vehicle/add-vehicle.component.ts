import { Component, OnInit } from '@angular/core';
import { YearMakeModelService } from '../year-make-model.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {

  years: number[];

  constructor(private yearMakeModelService: YearMakeModelService) { }

  ngOnInit() {
    this.yearMakeModelService.getYears().subscribe(years => this.years = years);
  }

}
