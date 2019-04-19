import { Injectable } from '@angular/core';
import { Feedback } from '../models/feedback';
import { DefaultHttpOptions } from '../default-http-options';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  post(feedback: Feedback) {
    return this.http.post<Feedback>('api/feedback', feedback, DefaultHttpOptions);
  }
}
