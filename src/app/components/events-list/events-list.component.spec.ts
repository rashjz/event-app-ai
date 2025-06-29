import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { EventsListComponent } from './events-list.component';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { Category } from '../../models/category';
import { Router } from '@angular/router';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  const mockCategory: Category = {
    id: 1,
    name: 'Music'
  };

  const mockEvents: Event[] = [
    {
      id: 1,
      type: 'concert',
      title: 'Test Concert',
      description: 'A test concert',
      date: '2024-12-25',
      image: 'test-image.jpg',
      category: mockCategory
    },
    {
      id: 2,
      type: 'movie',
      title: 'Test Movie',
      description: 'A test movie',
      date: '2024-12-26',
      image: 'movie-image.jpg',
      category: mockCategory
    }
  ];

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ EventsListComponent ],
      imports: [ RouterTestingModule, HttpClientTestingModule ],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load events on initialization', () => {
      eventService.getEvents.and.returnValue(of(mockEvents));

      fixture.detectChanges();

      expect(eventService.getEvents).toHaveBeenCalled();
      expect(component.events).toEqual(mockEvents);
      expect(component.filteredEvents).toEqual(mockEvents);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
    });

    it('should handle error when loading events fails', () => {
      const errorMessage = 'Failed to load events';
      eventService.getEvents.and.returnValue(throwError(() => new Error(errorMessage)));

      fixture.detectChanges();

      expect(eventService.getEvents).toHaveBeenCalled();
      expect(component.error).toBe('Failed to load events. Please try again.');
      expect(component.loading).toBeFalse();
    });
  });

  describe('ngOnChanges', () => {
    it('should filter events when selectedCategory changes', () => {
      component.events = mockEvents;
      component.filteredEvents = mockEvents;
      
      const changes = {
        selectedCategory: {
          currentValue: mockCategory,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(component.filteredEvents.length).toBe(2);
      expect(component.filteredEvents[0].category?.id).toBe(mockCategory.id);
    });

    it('should show all events when selectedCategory is null', () => {
      component.events = mockEvents;
      component.selectedCategory = mockCategory;
      component.filteredEvents = [mockEvents[0]]; // Only one event filtered
      
      const changes = {
        selectedCategory: {
          currentValue: null,
          previousValue: mockCategory,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component.filteredEvents).toEqual(mockEvents);
    });

    it('should not filter events when selectedCategory is not in changes', () => {
      component.events = mockEvents;
      component.filteredEvents = mockEvents;
      
      const changes = {
        someOtherProperty: {
          currentValue: 'value',
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(component.filteredEvents).toEqual(mockEvents);
    });
  });

  describe('loadEvents', () => {
    it('should load events successfully', () => {
      eventService.getEvents.and.returnValue(of(mockEvents));

      component.loadEvents();

      expect(component.loading).toBeTrue();
      expect(component.error).toBe('');
      
      // Simulate the async operation
      fixture.detectChanges();

      expect(component.events).toEqual(mockEvents);
      expect(component.filteredEvents).toEqual(mockEvents);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when loading events fails', () => {
      eventService.getEvents.and.returnValue(throwError(() => new Error('Network error')));

      component.loadEvents();

      expect(component.loading).toBeTrue();
      
      // Simulate the async operation
      fixture.detectChanges();

      expect(component.error).toBe('Failed to load events. Please try again.');
      expect(component.loading).toBeFalse();
    });
  });

  describe('filterEvents', () => {
    beforeEach(() => {
      component.events = mockEvents;
    });

    it('should show all events when no category is selected', () => {
      component.selectedCategory = null;

      component.filterEvents();

      expect(component.filteredEvents).toEqual(mockEvents);
    });

    it('should filter events by selected category', () => {
      component.selectedCategory = mockCategory;

      component.filterEvents();

      expect(component.filteredEvents.length).toBe(2);
      expect(component.filteredEvents[0].category?.id).toBe(mockCategory.id);
      expect(component.filteredEvents[1].category?.id).toBe(mockCategory.id);
    });

    it('should return empty array when no events match category', () => {
      const differentCategory: Category = { id: 999, name: 'Different Category' };
      component.selectedCategory = differentCategory;

      component.filterEvents();

      expect(component.filteredEvents).toEqual([]);
    });

    it('should handle events without category', () => {
      const eventWithoutCategory: Event = {
        id: 3,
        type: 'event',
        title: 'Event without category',
        description: 'An event without category',
        date: '2024-12-27'
      };
      component.events = [...mockEvents, eventWithoutCategory];
      component.selectedCategory = mockCategory;

      component.filterEvents();

      expect(component.filteredEvents.length).toBe(2);
      expect(component.filteredEvents.every(event => event.category?.id === mockCategory.id)).toBeTrue();
    });
  });

  describe('onEventClick', () => {
    it('should navigate to event detail when event has id', () => {
      const event = mockEvents[0];

      component.onEventClick(event);

      expect(router.navigate).toHaveBeenCalledWith(['/event', event.id]);
    });

    it('should not navigate when event has no id', () => {
      const eventWithoutId: Event = {
        type: 'event',
        title: 'Event without ID',
        description: 'An event without ID',
        date: '2024-12-27'
      };

      component.onEventClick(eventWithoutId);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onImageError', () => {
    it('should set fallback image when image fails to load', () => {
      const mockEvent = {
        target: {
          src: 'invalid-image.jpg'
        }
      };

      component.onImageError(mockEvent);

      expect(mockEvent.target.src).toBe('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop');
    });
  });

  describe('getEventTypeIcon', () => {
    it('should return correct icon for movie type', () => {
      const icon = component.getEventTypeIcon('movie');
      expect(icon).toBe('🎬');
    });

    it('should return correct icon for concert type', () => {
      const icon = component.getEventTypeIcon('concert');
      expect(icon).toBe('🎵');
    });

    it('should return correct icon for event type', () => {
      const icon = component.getEventTypeIcon('event');
      expect(icon).toBe('🎉');
    });

    it('should return correct icon for custom type', () => {
      const icon = component.getEventTypeIcon('custom');
      expect(icon).toBe('📝');
    });

    it('should return default icon for unknown type', () => {
      const icon = component.getEventTypeIcon('unknown');
      expect(icon).toBe('📅');
    });

    it('should handle case insensitive input', () => {
      const icon = component.getEventTypeIcon('MOVIE');
      expect(icon).toBe('🎬');
    });
  });

  describe('getCategoryName', () => {
    it('should return category name when category exists', () => {
      const categoryName = component.getCategoryName(mockCategory);
      expect(categoryName).toBe('Music');
    });

    it('should return empty string when category is undefined', () => {
      const categoryName = component.getCategoryName(undefined);
      expect(categoryName).toBe('');
    });

    it('should return empty string when category is null', () => {
      const categoryName = component.getCategoryName(null as any);
      expect(categoryName).toBe('');
    });
  });

  describe('component state', () => {
    it('should initialize with correct default values', () => {
      expect(component.events).toEqual([]);
      expect(component.filteredEvents).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('');
      expect(component.selectedCategory).toBeNull();
    });

    it('should update loading state correctly', () => {
      component.loading = true;
      expect(component.loading).toBeTrue();

      component.loading = false;
      expect(component.loading).toBeFalse();
    });

    it('should update error state correctly', () => {
      const errorMessage = 'Test error message';
      component.error = errorMessage;
      expect(component.error).toBe(errorMessage);
    });
  });
}); 