package com.example.eventsapp.service;

import com.example.eventsapp.model.Rating;
import com.example.eventsapp.model.User;
import com.example.eventsapp.model.Event;
import com.example.eventsapp.repository.RatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RatingService {

    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    // Submit or update a rating
    public Rating submitRating(User user, Event event, Integer ratingValue) {
        if (ratingValue < 1 || ratingValue > 5) {
            throw new IllegalArgumentException("Rating value must be between 1 and 5");
        }

        Optional<Rating> existingRating = ratingRepository.findByUserAndEvent(user, event);

        if (existingRating.isPresent()) {
            // Update existing rating
            Rating rating = existingRating.get();
            rating.setRatingValue(ratingValue);
            return ratingRepository.save(rating);
        } else {
            // Create new rating
            Rating newRating = new Rating(user, event, ratingValue);
            return ratingRepository.save(newRating);
        }
    }

    // Get user's rating for an event
    public Optional<Rating> getUserRatingForEvent(User user, Event event) {
        return ratingRepository.findByUserAndEvent(user, event);
    }

    // Get all ratings for an event
    public List<Rating> getRatingsForEvent(Event event) {
        return ratingRepository.findByEvent(event);
    }

    // Get average rating for an event
    public Double getAverageRatingForEvent(Event event) {
        Double avg = ratingRepository.getAverageRatingByEvent(event);
        return avg != null ? avg : 0.0;
    }

    // Get rating count for an event
    public Long getRatingCountForEvent(Event event) {
        return ratingRepository.getRatingCountByEvent(event);
    }

    // Delete a rating
    public void deleteRating(Long ratingId, User user) {
        Optional<Rating> rating = ratingRepository.findById(ratingId);
        if (rating.isPresent() && rating.get().getUser().equals(user)) {
            ratingRepository.delete(rating.get());
        } else {
            throw new IllegalArgumentException("Rating not found or user not authorized");
        }
    }

    // Check if user has rated an event
    public boolean hasUserRatedEvent(User user, Event event) {
        return ratingRepository.existsByUserAndEvent(user, event);
    }
}
