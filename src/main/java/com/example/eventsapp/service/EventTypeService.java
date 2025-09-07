package com.example.eventsapp.service;

import com.example.eventsapp.model.EventType;
import com.example.eventsapp.repository.EventTypeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventTypeService {
    private final EventTypeRepository repository;

    public EventTypeService(EventTypeRepository repository) {
        this.repository = repository;
    }

    public List<EventType> getAllEventTypes() {
        return repository.findAll();
    }

    public EventType getEventType(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("EventType not found with id: " + id));
    }

    public EventType createEventType(EventType eventType) {
        return repository.save(eventType);
    }

    public EventType updateEventType(EventType eventType) {
        if (!repository.existsById(eventType.getId())) {
            throw new RuntimeException("EventType not found with id: " + eventType.getId());
        }
        return repository.save(eventType);
    }

    public void deleteEventType(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("EventType not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
