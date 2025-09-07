import { Component, OnInit } from '@angular/core';
import { EventsListComponent } from '../events-list/events-list.component';
import { CategoryService } from '../../services/category.service';
import { EventTypeService } from '../../services/event-type.service';
import { Category } from '../../models/category';
import { EventType } from '../../models/event-type';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  showChat = false;
  categories: Category[] = [];
  eventTypes: EventType[] = [];
  selectedCategory: Category | null = null;
  selectedEventTypeId: number | null = null;
  selectedEventTypeName: string | null = null;
  loading = false;
  menuOpen = false;

  constructor(private categoryService: CategoryService, private eventTypeService: EventTypeService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadEventTypes();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
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

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
  }

  selectEventType(eventType: EventType | null): void {
    this.selectedEventTypeId = eventType ? eventType.id || null : null;
    this.selectedEventTypeName = eventType ? eventType.name : null;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  onEventAdded(): void {
    // This will be called when an event is added through chat
    // We can refresh the events list here if needed
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
