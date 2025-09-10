import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsListComponent } from '../events-list/events-list.component';
import { CategoryService } from '../../services/category.service';
import { EventFilterService } from '../../services/event-filter.service';
import { Category } from '../../models/category';
import { EventType } from '../../models/event-type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  showChat = false;
  showSearch = false;
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  selectedEventType: EventType | null = null;
  selectedEventTypeId: number | null = null;
  selectedEventTypeName: string | null = null;
  loading = false;
  menuOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private eventFilterService: EventFilterService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.subscribeToEventTypeChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToEventTypeChanges(): void {
    this.subscription.add(
      this.eventFilterService.selectedEventType$.subscribe(eventType => {
        console.log('Main page received event type change:', eventType);
        this.selectedEventType = eventType;
        this.selectedEventTypeId = eventType ? eventType.id || null : null;
        this.selectedEventTypeName = eventType ? eventType.name : null;
        console.log('Main page updated: selectedEventTypeId =', this.selectedEventTypeId, 'selectedEventTypeName =', this.selectedEventTypeName);
      })
    );

    this.subscription.add(
      this.eventFilterService.selectedCategory$.subscribe(category => {
        this.selectedCategory = category;
      })
    );
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

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.eventFilterService.setSelectedCategory(category);
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  closeSearch(): void {
    this.showSearch = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onEventAdded(): void {
    // This will be called when an event is added through chat
    // We can refresh the events list here if needed
  }
}
