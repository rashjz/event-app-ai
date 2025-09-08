package com.example.eventsapp.controller;

import com.example.eventsapp.model.EventType;
import com.example.eventsapp.service.EventTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/event-types")
@CrossOrigin(origins = "*")
public class EventTypeController {
    private final EventTypeService service;

    public EventTypeController(EventTypeService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventType> getAllEventTypes() {
        return service.getAllEventTypes();
    }

    @GetMapping("/{id}")
    public EventType getEventType(@PathVariable Long id) {
        return service.getEventType(id);
    }

    @PostMapping
    public ResponseEntity<EventType> createEventType(@RequestBody EventType eventType) {
        try {
            EventType created = service.createEventType(eventType);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventType> updateEventType(@PathVariable Long id, @RequestBody EventType eventType) {
        eventType.setId(id);
        try {
            EventType updated = service.updateEventType(eventType);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEventType(@PathVariable Long id) {
        service.deleteEventType(id);
    }
}
