import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { Category } from '../../models/category';

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
    private eventService: EventService
  ) { }

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
      next: (event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load event details. Please try again.';
        this.loading = false;
        console.error('Error loading event:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
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

  onImageError(event: any): void {
    // Set a default image if the original fails to load
    event.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop';
  }

  getCategoryName(category: Category | undefined): string {
    return category ? category.name : '';
  }
} 