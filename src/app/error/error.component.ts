import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css'],
    imports: [RouterLink]
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
