import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8080/api/events/search';

  constructor(private http: HttpClient) {}

  searchEvents(query: string, filters?: any): Observable<Event[]> {
    let params = new HttpParams().set('q', query.trim());
    if (filters) {
      if (filters.category && filters.category.trim()) {
        params = params.set('category', filters.category.trim());
      }
      if (filters.eventType && filters.eventType.trim()) {
        params = params.set('eventType', filters.eventType.trim());
      }
      if (filters.date && filters.date.trim()) {
        params = params.set('date', filters.date.trim());
      }
      if (filters.location && filters.location.trim()) {
        params = params.set('location', filters.location.trim());
      }
    }
    return this.http.get<Event[]>(this.apiUrl, { params });
  }

  getAutocompleteSuggestions(query: string): Observable<string[]> {
    if (!query || query.trim().length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.http.get<string[]>(`${this.apiUrl}/autocomplete`, {
      params: new HttpParams().set('q', query.trim())
    });
  }
}
