import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { Category } from '../../models/category';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit, OnChanges {
  @Input() selectedCategory: Category | null = null;
  @Input() selectedEventTypeId: number | null = null;
  @Input() selectedEventTypeName: string | null = null;

  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading = false;
  error = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('EventsList ngOnChanges:', changes);
    if (changes['selectedCategory'] || changes['selectedEventTypeId']) {
      console.log('EventsList: selectedEventTypeId changed to:', this.selectedEventTypeId);
      this.filterEvents();
    }
  }

  loadEvents(): void {
    this.loading = true;
    this.error = '';

    if (this.selectedEventTypeId) {
      this.loadEventsByEventType();
    } else {
      this.eventService.getEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.filterEvents();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load events. Please try again.';
          this.loading = false;
          console.error('Error loading events:', error);
        }
      });
    }
  }

  loadEventsByEventType(): void {
    if (!this.selectedEventTypeId) return;

    this.eventService.getEventsByEventType(this.selectedEventTypeId).subscribe({
      next: (events) => {
        this.events = events;
        this.filterEvents();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events by event type. Please try again.';
        this.loading = false;
        console.error('Error loading events by event type:', error);
      }
    });
  }

  filterEvents(): void {
    let filtered = this.events;

    // Filter by category if selected
    if (this.selectedCategory) {
      filtered = filtered.filter(event =>
        event.category && event.category.id === this.selectedCategory!.id
      );
    }

    // Filter by event type if selected (additional filtering on already loaded events)
    if (this.selectedEventTypeId) {
      filtered = filtered.filter(event =>
        event.eventType && event.eventType.id === this.selectedEventTypeId
      );
    }

    this.filteredEvents = filtered;
  }

  onEventClick(event: Event): void {
    if (event.id) {
      this.router.navigate(['/event', event.id]);
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop';
  }

  getEventTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'movie': return '🎬';
      case 'concert': return '🎵';
      case 'event': return '🎉';
      case 'custom': return '📝';
      default: return '📅';
    }
  }

  getCategoryName(category: Category | undefined): string {
    return category ? category.name : '';
  }

  getEventTypeName(eventType: any): string {
    return eventType ? eventType.name : '';
  }
}
