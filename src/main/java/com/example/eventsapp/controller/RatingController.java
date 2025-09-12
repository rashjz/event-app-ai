package com.example.eventsapp.controller;

import com.example.eventsapp.model.Rating;
import com.example.eventsapp.model.User;
import com.example.eventsapp.model.Event;
import com.example.eventsapp.service.RatingService;
import com.example.eventsapp.service.EventService;
import com.example.eventsapp.service.CustomUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    private final RatingService ratingService;
    private final EventService eventService;
    private final CustomUserDetailsService userDetailsService;

    public RatingController(RatingService ratingService, EventService eventService, CustomUserDetailsService userDetailsService) {
        this.ratingService = ratingService;
        this.eventService = eventService;
        this.userDetailsService = userDetailsService;
    }

    // Submit or update rating for an event
    @PostMapping("/events/{eventId}")
    public ResponseEntity<?> submitRating(@PathVariable Long eventId, @RequestBody Map<String, Integer> request) {
        try {
            User currentUser = getCurrentUser();
            Event event = eventService.getEvent(eventId);

            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            Integer ratingValue = request.get("ratingValue");
            if (ratingValue == null || ratingValue < 1 || ratingValue > 5) {
                return ResponseEntity.badRequest().body("Rating value must be between 1 and 5");
            }

            Rating rating = ratingService.submitRating(currentUser, event, ratingValue);

            Map<String, Object> response = new HashMap<>();
            response.put("rating", rating);
            response.put("averageRating", ratingService.getAverageRatingForEvent(event));
            response.put("ratingCount", ratingService.getRatingCountForEvent(event));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user's rating for an event
    @GetMapping("/events/{eventId}/user")
    public ResponseEntity<?> getUserRating(@PathVariable Long eventId) {
        try {
            User currentUser = getCurrentUser();
            Event event = eventService.getEvent(eventId);

            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            Optional<Rating> rating = ratingService.getUserRatingForEvent(currentUser, event);
            return ResponseEntity.ok(rating.orElse(null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get rating statistics for an event
    @GetMapping("/events/{eventId}/stats")
    public ResponseEntity<?> getRatingStats(@PathVariable Long eventId) {
        try {
            Event event = eventService.getEvent(eventId);

            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> stats = new HashMap<>();
            stats.put("averageRating", ratingService.getAverageRatingForEvent(event));
            stats.put("ratingCount", ratingService.getRatingCountForEvent(event));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete user's rating for an event
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long ratingId) {
        try {
            User currentUser = getCurrentUser();
            ratingService.deleteRating(ratingId, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userDetailsService.getUserByEmail(email);
    }
}
