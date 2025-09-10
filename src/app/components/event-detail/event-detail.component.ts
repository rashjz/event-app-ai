import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { EventFilterService } from '../../services/event-filter.service';
import { Event } from '../../models/event';
import { Category } from '../../models/category';
import { EventType } from '../../models/event-type';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private eventFilterService: EventFilterService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(+id);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.error = '';

    this.eventService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load event details. Please try again.';
        this.loading = false;
        console.error('Error loading event:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onImageError(event: any): void {
    // Set a default image if the original fails to load
    event.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop';
  }

  getCategoryName(category: Category | undefined): string {
    return category ? category.name : '';
  }

  getEventTypeName(eventType: any): string {
    return eventType ? eventType.name : '';
  }

  onEventTypeClick(eventType: EventType): void {
    console.log('Event type clicked:', eventType);
    // Set the selected event type in the filter service
    this.eventFilterService.setSelectedEventType(eventType);
    console.log('Event type set in filter service');
    // Navigate to main page where the filtered events will be loaded
    this.router.navigate(['/']);
    console.log('Navigation to main page completed');
  }
}
