import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Rating, RatingStats } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/api/ratings';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Submit or update rating for an event
  submitRating(eventId: number, ratingValue: number): Observable<any> {
    const body = { ratingValue };
    return this.http.post(`${this.apiUrl}/events/${eventId}`, body, { headers: this.getHeaders() });
  }

  // Get user's rating for an event
  getUserRating(eventId: number): Observable<Rating | null> {
    return this.http.get<Rating | null>(`${this.apiUrl}/events/${eventId}/user`, { headers: this.getHeaders() });
  }

  // Get rating statistics for an event
  getRatingStats(eventId: number): Observable<RatingStats> {
    return this.http.get<RatingStats>(`${this.apiUrl}/events/${eventId}/stats`);
  }

  // Delete user's rating
  deleteRating(ratingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ratingId}`, { headers: this.getHeaders() });
  }
}
