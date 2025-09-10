import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventType } from '../models/event-type';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class EventFilterService {
  private selectedEventTypeSubject = new BehaviorSubject<EventType | null>(null);
  private selectedCategorySubject = new BehaviorSubject<Category | null>(null);

  public selectedEventType$ = this.selectedEventTypeSubject.asObservable();
  public selectedCategory$ = this.selectedCategorySubject.asObservable();

  constructor() {}

  setSelectedEventType(eventType: EventType | null): void {
    this.selectedEventTypeSubject.next(eventType);
  }

  setSelectedCategory(category: Category | null): void {
    this.selectedCategorySubject.next(category);
  }

  getCurrentEventType(): EventType | null {
    return this.selectedEventTypeSubject.value;
  }

  getCurrentCategory(): Category | null {
    return this.selectedCategorySubject.value;
  }

  clearFilters(): void {
    this.selectedEventTypeSubject.next(null);
    this.selectedCategorySubject.next(null);
  }
}
