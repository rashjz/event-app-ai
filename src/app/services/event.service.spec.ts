import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { Event } from '../models/event';
import { Category } from '../models/category';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  const mockCategory: Category = {
    id: 1,
    name: 'Music'
  };

  const mockEvent: Event = {
    id: 1,
    type: 'concert',
    title: 'Test Concert',
    description: 'A test concert',
    date: '2024-12-25',
    image: 'test-image.jpg',
    category: mockCategory
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should return an Observable<Event[]>', () => {
      const mockEvents: Event[] = [mockEvent];

      service.getEvents().subscribe(events => {
        expect(events).toEqual(mockEvents);
        expect(events.length).toBe(1);
        expect(events[0].title).toBe('Test Concert');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events');
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

    it('should handle empty response', () => {
      service.getEvents().subscribe(events => {
        expect(events).toEqual([]);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events');
      req.flush([]);
    });

    it('should handle error response', () => {
      service.getEvents().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getEvent', () => {
    it('should return an Observable<Event> for valid id', () => {
      service.getEvent(1).subscribe(event => {
        expect(event).toEqual(mockEvent);
        expect(event.id).toBe(1);
        expect(event.title).toBe('Test Concert');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });

    it('should handle error for invalid id', () => {
      service.getEvent(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createEvent', () => {
    it('should create a new event and return Observable<Event>', () => {
      const newEvent: Event = {
        type: 'movie',
        title: 'New Movie',
        description: 'A new movie event',
        date: '2024-12-26'
      };

      service.createEvent(newEvent).subscribe(event => {
        expect(event).toEqual(mockEvent);
        expect(event.title).toBe('Test Concert');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEvent);
      req.flush(mockEvent);
    });

    it('should handle validation error', () => {
      const invalidEvent: Event = {
        type: '',
        title: '',
        description: '',
        date: ''
      };

      service.createEvent(invalidEvent).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event and return Observable<Event>', () => {
      const updatedEvent: Event = {
        id: 1,
        type: 'event',
        title: 'Updated Event',
        description: 'An updated event',
        date: '2024-12-27'
      };

      service.updateEvent(1, updatedEvent).subscribe(event => {
        expect(event).toEqual(mockEvent);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedEvent);
      req.flush(mockEvent);
    });

    it('should handle error when event not found', () => {
      const updatedEvent: Event = {
        id: 999,
        type: 'event',
        title: 'Updated Event',
        description: 'An updated event',
        date: '2024-12-27'
      };

      service.updateEvent(999, updatedEvent).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event and return Observable<void>', () => {
      service.deleteEvent(1).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when event not found for deletion', () => {
      service.deleteEvent(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/999');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('sendChatMessage', () => {
    it('should send a chat message and return Observable<void>', () => {
      const message = 'Hello, this is a test message';

      service.sendChatMessage(message).subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/chat');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(message);
      req.flush(null);
    });

    it('should handle error when sending chat message fails', () => {
      const message = 'Hello, this is a test message';

      service.sendChatMessage(message).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/events/chat');
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
}); 