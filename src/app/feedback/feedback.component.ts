import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback.service';
import { Feedback } from '../models/feedback';
import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css'],
    imports: [RouterLink, FormsModule]
})
export class FeedbackComponent implements OnInit {

  feedback: Feedback = { message: '', email: '' };
  submitted = false;

  constructor(private feedbackService: FeedbackService) { }

  ngOnInit() {
  }

  submit() {
    this.feedbackService.post(this.feedback).subscribe(() => this.submitted = true);
  }

}
