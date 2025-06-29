package com.example.eventsapp.service;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.model.Category;
import com.example.eventsapp.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Music");

        testEvent = new Event();
        testEvent.setId(1L);
        testEvent.setTitle("Test Concert");
        testEvent.setType("concert");
        testEvent.setDescription("A test concert");
        testEvent.setDate("2024-12-25");
        testEvent.setImage("test-image.jpg");
        testEvent.setCategory(testCategory);
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        // Arrange
        List<Event> expectedEvents = Arrays.asList(testEvent);
        when(eventRepository.findAll()).thenReturn(expectedEvents);

        // Act
        List<Event> actualEvents = eventService.getAllEvents();

        // Assert
        assertEquals(expectedEvents, actualEvents);
        assertEquals(1, actualEvents.size());
        assertEquals("Test Concert", actualEvents.get(0).getTitle());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getEvent_WithValidId_ShouldReturnEvent() {
        // Arrange
        when(eventRepository.findById(1L)).thenReturn(Optional.of(testEvent));

        // Act
        Event actualEvent = eventService.getEvent(1L);

        // Assert
        assertEquals(testEvent, actualEvent);
        assertEquals("Test Concert", actualEvent.getTitle());
        verify(eventRepository, times(1)).findById(1L);
    }

    @Test
    void getEvent_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventService.getEvent(999L);
        });

        assertEquals("Event not found with id: 999", exception.getMessage());
        verify(eventRepository, times(1)).findById(999L);
    }

    @Test
    void createEvent_WithValidEvent_ShouldReturnSavedEvent() {
        // Arrange
        Event newEvent = new Event();
        newEvent.setTitle("New Event");
        newEvent.setType("movie");
        newEvent.setDescription("A new event");
        newEvent.setDate("2024-12-26");

        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event savedEvent = eventService.createEvent(newEvent);

        // Assert
        assertEquals(testEvent, savedEvent);
        assertEquals("Test Concert", savedEvent.getTitle());
        verify(eventRepository, times(1)).save(newEvent);
    }

    @Test
    void updateEvent_WithValidEvent_ShouldReturnUpdatedEvent() {
        // Arrange
        Event updatedEvent = new Event();
        updatedEvent.setId(1L);
        updatedEvent.setTitle("Updated Event");
        updatedEvent.setType("event");
        updatedEvent.setDescription("An updated event");
        updatedEvent.setDate("2024-12-27");

        when(eventRepository.existsById(1L)).thenReturn(true);
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event result = eventService.updateEvent(updatedEvent);

        // Assert
        assertEquals(testEvent, result);
        verify(eventRepository, times(1)).existsById(1L);
        verify(eventRepository, times(1)).save(updatedEvent);
    }

    @Test
    void updateEvent_WithInvalidId_ShouldThrowException() {
        // Arrange
        Event updatedEvent = new Event();
        updatedEvent.setId(999L);
        updatedEvent.setTitle("Updated Event");

        when(eventRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventService.updateEvent(updatedEvent);
        });

        assertEquals("Event not found with id: 999", exception.getMessage());
        verify(eventRepository, times(1)).existsById(999L);
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void deleteEvent_WithValidId_ShouldDeleteEvent() {
        // Arrange
        when(eventRepository.existsById(1L)).thenReturn(true);
        doNothing().when(eventRepository).deleteById(1L);

        // Act
        eventService.deleteEvent(1L);

        // Assert
        verify(eventRepository, times(1)).existsById(1L);
        verify(eventRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteEvent_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(eventRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventService.deleteEvent(999L);
        });

        assertEquals("Event not found with id: 999", exception.getMessage());
        verify(eventRepository, times(1)).existsById(999L);
        verify(eventRepository, never()).deleteById(any(Long.class));
    }

    @Test
    void createEvent_WithNullEvent_ShouldHandleGracefully() {
        // Arrange
        when(eventRepository.save(null)).thenThrow(new IllegalArgumentException("Event cannot be null"));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(null);
        });

        verify(eventRepository, times(1)).save(null);
    }

    @Test
    void getAllEvents_WhenRepositoryReturnsEmptyList_ShouldReturnEmptyList() {
        // Arrange
        when(eventRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Event> actualEvents = eventService.getAllEvents();

        // Assert
        assertTrue(actualEvents.isEmpty());
        verify(eventRepository, times(1)).findAll();
    }
} 