import { Component, OnInit } from '@angular/core';
import { Event } from '../../models/event';
import { Category } from '../../models/category';
import { EventType } from '../../models/event-type';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { EventTypeService } from '../../services/event-type.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  events: Event[] = [];
  categories: Category[] = [];
  eventTypes: EventType[] = [];
  users: User[] = [];
  selectedEvent: Event | null = null;
  selectedEventType: EventType | null = null;
  isEditing = false;
  isAdding = false;
  isAddingEventType = false;
  isEditingEventType = false;
  activeTab: 'events' | 'categories' | 'event-types' | 'users' = 'events';
  newEvent: Event = {
    title: '',
    description: '',
    date: '',
    image: ''
  };
  newEventType: EventType = {
    name: ''
  };
  currentEventTypeName: string = '';

  quillConfig = {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'direction': 'rtl' }],
        ['clean']
      ]
    },
    placeholder: 'Enter event description...',
    readOnly: false,
    bounds: document.body,
    formats: [
      'header', 'font', 'size',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'video',
      'color', 'background',
      'align', 'script', 'direction'
    ]
  };

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private eventTypeService: EventTypeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
    this.loadEventTypes();
    this.loadUsers();
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

  loadEventTypes(): void {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (eventTypes) => this.eventTypes = eventTypes,
      error: (error) => console.error('Error loading event types:', error)
    });
  }

  setActiveTab(tab: 'events' | 'categories' | 'event-types' | 'users'): void {
    this.activeTab = tab;
    this.cancel();
  }

  addEvent(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.selectedEvent = null;
    this.newEvent = {
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
    this.isAddingEventType = false;
    this.isEditingEventType = false;
    this.selectedEvent = null;
    this.selectedEventType = null;
    this.currentEventTypeName = '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getCategoryName(category: Category | undefined): string {
    return category ? category.name : '-';
  }

  // Event Type Management Methods
  addEventType(): void {
    this.isAddingEventType = true;
    this.isEditingEventType = false;
    this.selectedEventType = null;
    this.currentEventTypeName = '';
    this.newEventType = {
      name: ''
    };
  }

  editEventType(eventType: EventType): void {
    this.selectedEventType = { ...eventType };
    this.currentEventTypeName = eventType.name;
    this.isEditingEventType = true;
    this.isAddingEventType = false;
  }

  deleteEventType(eventType: EventType): void {
    if (confirm(`Are you sure you want to delete "${eventType.name}"?`)) {
      this.eventTypeService.deleteEventType(eventType.id!).subscribe({
        next: () => {
          this.loadEventTypes();
          alert('Event type deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting event type:', error);
          alert('Error deleting event type. Please try again.');
        }
      });
    }
  }

  saveEventType(): void {
    const trimmedName = this.currentEventTypeName.trim();
    if (!trimmedName) {
      alert('Event type name cannot be empty.');
      return;
    }
    if (this.isAddingEventType) {
      this.newEventType.name = trimmedName;
      this.eventTypeService.createEventType(this.newEventType).subscribe({
        next: () => {
          this.loadEventTypes();
          this.isAddingEventType = false;
          this.currentEventTypeName = '';
          this.newEventType = { name: '' };
          alert('Event type added successfully!');
        },
        error: (error) => {
          console.error('Error adding event type:', error);
          alert('Error adding event type. Please try again.');
        }
      });
    } else if (this.isEditingEventType && this.selectedEventType) {
      this.selectedEventType.name = trimmedName;
      this.eventTypeService.updateEventType(this.selectedEventType.id!, this.selectedEventType).subscribe({
        next: () => {
          this.loadEventTypes();
          this.isEditingEventType = false;
          this.selectedEventType = null;
          this.currentEventTypeName = '';
          alert('Event type updated successfully!');
        },
        error: (error) => {
          console.error('Error updating event type:', error);
          alert('Error updating event type. Please try again.');
        }
      });
    }
  }

  getEventTypeName(eventType: EventType | undefined): string {
    return eventType ? eventType.name : '-';
  }

  // User Management Methods
  loadUsers(): void {
    this.http.get<User[]>('/api/admin/users').subscribe({
      next: (users) => {
        console.log('Loaded users:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Error loading users. Please check your authentication.');
      }
    });
  }

  toggleUserStatus(user: User): void {
    if (!user.id) return;

    const action = user.active ? 'deactivate' : 'activate';
    const confirmMessage = `Are you sure you want to ${action} user "${user.name || user.email}"?`;

    if (confirm(confirmMessage)) {
      const url = `/api/admin/users/${user.id}/${action}`;
      this.http.put(url, {}, { responseType: 'text' }).subscribe({
        next: (response) => {
          console.log(`${action} response:`, response);
          this.loadUsers();
          alert(`User ${action}d successfully!`);
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
          alert(`Error ${action}ing user. Please try again.`);
        }
      });
    }
  }
}
