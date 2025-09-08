package com.example.eventsapp.controller;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.service.EventService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return service.getAllEvents();
    }

    @GetMapping("/{id}")
    public Event getEvent(@PathVariable Long id) {
        return service.getEvent(id);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return service.createEvent(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        event.setId(id);
        return service.updateEvent(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
    }

    @GetMapping("/event-type/{eventTypeId}")
    public List<Event> getEventsByEventType(@PathVariable Long eventTypeId) {
        return service.getEventsByEventType(eventTypeId);
    }

    @GetMapping("/search")
    public List<Event> searchEvents(@RequestParam Map<String, String> params) {
        String q = params.get("q");
        String category = params.get("category");
        String eventType = params.get("eventType");
        String date = params.get("date");
        String location = params.get("location");

        if (q == null || q.trim().isEmpty()) {
            return List.of(); // Return empty list for empty query
        }

        return service.searchEvents(q, category, eventType, date, location);
    }

    @GetMapping("/search/autocomplete")
    public List<String> getAutocompleteSuggestions(@RequestParam(required = false) String q) {
        if (q == null || q.trim().isEmpty()) {
            return List.of();
        }
        return service.getAutocompleteSuggestions(q);
    }
}
