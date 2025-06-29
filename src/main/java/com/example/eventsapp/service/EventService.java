package com.example.eventsapp.service;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.repository.EventRepository;
import org.springframework.stereotype.Service;
import java.util.List;

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
} 