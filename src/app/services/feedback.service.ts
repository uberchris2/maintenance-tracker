import { Injectable } from '@angular/core';
import { Feedback } from '../models/feedback';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  post(feedback: Feedback) {
    return this.http.post<Feedback>(`${environment.publicApiEndpoint}api/feedback`, feedback);
  }
}
