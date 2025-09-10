import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './services/auth.service';
import { EventTypeService } from './services/event-type.service';
import { EventFilterService } from './services/event-filter.service';
import { EventType } from './models/event-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Events App';
  currentUser: User | null = null;
  isAuthModalVisible = false;
  showSearch = false;
  eventTypes: EventType[] = [];
  selectedEventTypeId: number | null = null;

  constructor(
    private authService: AuthService,
    private eventTypeService: EventTypeService,
    private eventFilterService: EventFilterService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Check for OAuth callback on app initialization
    this.authService.checkForOAuthCallback();

    this.loadEventTypes();
  }

  loadEventTypes(): void {
    this.eventTypeService.getAllEventTypes().subscribe({
      next: (eventTypes) => {
        this.eventTypes = eventTypes;
      },
      error: (error) => {
        console.error('Error loading event types:', error);
      }
    });
  }

  selectEventType(eventType: EventType | null): void {
    this.selectedEventTypeId = eventType ? eventType.id || null : null;
    this.eventFilterService.setSelectedEventType(eventType);
  }

  openAuthModal(): void {
    this.isAuthModalVisible = true;
  }

  closeAuthModal(): void {
    this.isAuthModalVisible = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  closeSearch(): void {
    this.showSearch = false;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
