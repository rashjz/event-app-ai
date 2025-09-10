import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { EventTypeService } from '../../services/event-type.service';
import { EventFilterService } from '../../services/event-filter.service';
import { EventType } from '../../models/event-type';

@Component({
  selector: 'app-shared-navbar',
  templateUrl: './shared-navbar.component.html',
  styleUrls: ['./shared-navbar.component.css']
})
export class SharedNavbarComponent implements OnInit {
  currentUser: User | null = null;
  eventTypes: EventType[] = [];
  selectedEventTypeId: number | null = null;

  @Output() openAuthModal = new EventEmitter<void>();
  @Output() toggleSearch = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() eventTypeSelected = new EventEmitter<EventType | null>();

  constructor(
    private authService: AuthService,
    private eventTypeService: EventTypeService,
    private eventFilterService: EventFilterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

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
    this.eventTypeSelected.emit(eventType);
  }

  onOpenAuthModal(): void {
    this.openAuthModal.emit();
  }

  onToggleSearch(): void {
    this.toggleSearch.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.logout.emit();
  }

  navigateToHome(): void {
    this.selectedEventTypeId = null;
    this.eventFilterService.setSelectedEventType(null);
    this.router.navigate(['/']);
  }
}
