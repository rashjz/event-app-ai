package com.example.eventsapp.controller;

import com.example.eventsapp.model.EventType;
import com.example.eventsapp.service.EventTypeService;
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
    public EventType createEventType(@RequestBody EventType eventType) {
        return service.createEventType(eventType);
    }

    @PutMapping("/{id}")
    public EventType updateEventType(@PathVariable Long id, @RequestBody EventType eventType) {
        eventType.setId(id);
        return service.updateEventType(eventType);
    }

    @DeleteMapping("/{id}")
    public void deleteEventType(@PathVariable Long id) {
        service.deleteEventType(id);
    }
}
