package com.example.eventsapp.controller;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.service.EventService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    private final EventService eventService;

    public ChatController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public void handleChat(@RequestBody String message) {
        // Simple logic: if message contains "add", add a new event
        if (message.toLowerCase().contains("add")) {
            Event event = new Event();
            event.setType("custom");
            event.setTitle("User Requested Event");
            event.setDescription(message);
            event.setDate("TBD");
            eventService.createEvent(event);
        }
        // In real app, parse message and update events accordingly
    }

    @GetMapping
    public String getStatus() {
        return "Chat service is running";
    }
} 