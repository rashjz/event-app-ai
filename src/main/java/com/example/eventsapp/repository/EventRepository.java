package com.example.eventsapp.repository;

import com.example.eventsapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {} 