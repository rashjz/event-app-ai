package com.example.eventsapp.repository;

import com.example.eventsapp.model.Rating;
import com.example.eventsapp.model.User;
import com.example.eventsapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find rating by user and event
    Optional<Rating> findByUserAndEvent(User user, Event event);

    // Find all ratings for an event
    List<Rating> findByEvent(Event event);

    // Find all ratings by a user
    List<Rating> findByUser(User user);

    // Check if user has rated an event
    boolean existsByUserAndEvent(User user, Event event);

    // Get average rating for an event
    @Query("SELECT AVG(r.ratingValue) FROM Rating r WHERE r.event = :event")
    Double getAverageRatingByEvent(@Param("event") Event event);

    // Get count of ratings for an event
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.event = :event")
    Long getRatingCountByEvent(@Param("event") Event event);
}
