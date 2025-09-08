package com.example.eventsapp.service;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Event getEvent(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public Event createEvent(Event event) {
        return repository.save(event);
    }

    public Event updateEvent(Event event) {
        if (!repository.existsById(event.getId())) {
            throw new RuntimeException("Event not found with id: " + event.getId());
        }
        return repository.save(event);
    }

    public void deleteEvent(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<Event> getEventsByEventType(Long eventTypeId) {
        return repository.findByEventTypeId(eventTypeId);
    }

    public List<Event> searchEvents(String query, String category, String eventType, String date, String location) {
        // For now, implement a simple search. In a real application, you'd use a search engine like Elasticsearch
        // or implement more sophisticated database queries
        List<Event> allEvents = repository.findAll();
        return allEvents.stream()
                .filter(event -> matchesSearchCriteria(event, query, category, eventType, date, location))
                .collect(Collectors.toList());
    }

    public List<String> getAutocompleteSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        // Return suggestions based on event titles and descriptions
        List<Event> allEvents = repository.findAll();
        return allEvents.stream()
                .filter(event -> event.getTitle() != null &&
                               (event.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                                (event.getDescription() != null && event.getDescription().toLowerCase().contains(query.toLowerCase()))))
                .map(Event::getTitle)
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
    }

    private boolean matchesSearchCriteria(Event event, String query, String category, String eventType, String date, String location) {
        boolean matchesQuery = query == null || query.trim().isEmpty() ||
                (event.getTitle() != null && event.getTitle().toLowerCase().contains(query.toLowerCase())) ||
                (event.getDescription() != null && event.getDescription().toLowerCase().contains(query.toLowerCase()));

        boolean matchesCategory = category == null || category.trim().isEmpty() ||
                (event.getCategory() != null && event.getCategory().getName() != null &&
                 event.getCategory().getName().toLowerCase().contains(category.toLowerCase()));

        boolean matchesEventType = eventType == null || eventType.trim().isEmpty() ||
                (event.getEventType() != null && event.getEventType().getName() != null &&
                 event.getEventType().getName().toLowerCase().contains(eventType.toLowerCase()));

        boolean matchesDate = date == null || date.trim().isEmpty() ||
                (event.getDate() != null && event.getDate().contains(date));

        // Note: Location search is not implemented as Event model doesn't have location field
        boolean matchesLocation = location == null || location.trim().isEmpty();

        return matchesQuery && matchesCategory && matchesEventType && matchesDate && matchesLocation;
    }
}
