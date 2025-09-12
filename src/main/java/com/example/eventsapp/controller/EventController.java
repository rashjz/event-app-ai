package com.example.eventsapp.controller;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.service.EventService;
import com.example.eventsapp.service.RatingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    private final EventService eventService;
    private final RatingService ratingService;

    public EventController(EventService eventService, RatingService ratingService) {
        this.eventService = eventService;
        this.ratingService = ratingService;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getEvent(@PathVariable Long id) {
        Event event = eventService.getEvent(id);
        Map<String, Object> response = new HashMap<>();
        response.put("event", event);
        response.put("averageRating", ratingService.getAverageRatingForEvent(event));
        response.put("ratingCount", ratingService.getRatingCountForEvent(event));
        return response;
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event event) {
        event.setId(id);
        return eventService.updateEvent(event);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }

    @GetMapping("/event-type/{eventTypeId}")
    public List<Event> getEventsByEventType(@PathVariable Long eventTypeId) {
        return eventService.getEventsByEventType(eventTypeId);
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

        return eventService.searchEvents(q, category, eventType, date, location);
    }

    @GetMapping("/search/autocomplete")
    public List<String> getAutocompleteSuggestions(@RequestParam(required = false) String q) {
        if (q == null || q.trim().isEmpty()) {
            return List.of();
        }
        return eventService.getAutocompleteSuggestions(q);
    }
}
