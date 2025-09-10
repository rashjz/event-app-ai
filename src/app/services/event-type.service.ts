import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventType } from '../models/event-type';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {
  private apiUrl = '/api/event-types';

  constructor(private http: HttpClient) {}

  getAllEventTypes(): Observable<EventType[]> {
    return this.http.get<EventType[]>(this.apiUrl);
  }

  createEventType(eventType: EventType): Observable<EventType> {
    return this.http.post<EventType>(this.apiUrl, eventType);
  }

  updateEventType(id: number, eventType: EventType): Observable<EventType> {
    return this.http.put<EventType>(`${this.apiUrl}/${id}`, eventType);
  }

  deleteEventType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
