import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { Category } from '../../models/category';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  selectedEvent: Event | null = null;
  isEditing = false;
  isAdding = false;
  activeTab: 'events' | 'categories' = 'events';
  newEvent: Event = {
    type: 'event',
    title: '',
    description: '',
    date: '',
    image: ''
  };

  quillConfig = {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
      ]
    },
    placeholder: 'Enter event description...',
    readOnly: false,
    bounds: document.body
  };

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => this.events = events,
      error: (error) => console.error('Error loading events:', error)
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  setActiveTab(tab: 'events' | 'categories'): void {
    this.activeTab = tab;
    this.cancel();
  }

  addEvent(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedEvent = null;
    this.newEvent = {
      type: 'event',
      title: '',
      description: '',
      date: '',
      image: ''
    };
  }

  editEvent(event: Event): void {
    this.selectedEvent = { ...event };
    this.isEditing = true;
    this.isAdding = false;
  }

  deleteEvent(event: Event): void {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.eventService.deleteEvent(event.id!).subscribe({
        next: () => {
          this.loadEvents();
          alert('Event deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          alert('Error deleting event. Please try again.');
        }
      });
    }
  }

  saveEvent(): void {
    if (this.isAdding) {
      this.eventService.createEvent(this.newEvent).subscribe({
        next: () => {
          this.loadEvents();
          this.isAdding = false;
          alert('Event added successfully!');
        },
        error: (error) => {
          console.error('Error adding event:', error);
          alert('Error adding event. Please try again.');
        }
      });
    } else if (this.isEditing && this.selectedEvent) {
      this.eventService.updateEvent(this.selectedEvent.id!, this.selectedEvent).subscribe({
        next: () => {
          this.loadEvents();
          this.isEditing = false;
          this.selectedEvent = null;
          alert('Event updated successfully!');
        },
        error: (error) => {
          console.error('Error updating event:', error);
          alert('Error updating event. Please try again.');
        }
      });
    }
  }

  cancel(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedEvent = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getCategoryName(category: Category | undefined): string {
    return category ? category.name : '-';
  }
}
