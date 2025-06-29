package com.example.eventsapp.controller;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.model.Category;
import com.example.eventsapp.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = EventController.class)
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void getAllEvents_ShouldReturnEventsList() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        when(eventService.getAllEvents()).thenReturn(events);
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Test Concert"))
                .andExpect(jsonPath("$[0].type").value("concert"));
        verify(eventService, times(1)).getAllEvents();
    }

    @Test
    void getEvent_WithValidId_ShouldReturnEvent() throws Exception {
        when(eventService.getEvent(1L)).thenReturn(testEvent);
        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Concert"));
        verify(eventService, times(1)).getEvent(1L);
    }

    @Test
    void getEvent_WithInvalidId_ShouldThrowException() throws Exception {
        when(eventService.getEvent(999L)).thenThrow(new RuntimeException("Event not found with id: 999"));
        mockMvc.perform(get("/api/events/999"))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof RuntimeException))
                .andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Event not found with id: 999")));
        verify(eventService, times(1)).getEvent(999L);
    }

    @Test
    void createEvent_WithValidEvent_ShouldReturnCreatedEvent() throws Exception {
        Event newEvent = new Event();
        newEvent.setTitle("New Event");
        newEvent.setType("movie");
        newEvent.setDescription("A new event");
        newEvent.setDate("2024-12-26");
        when(eventService.createEvent(any(Event.class))).thenReturn(testEvent);
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Concert"));
        verify(eventService, times(1)).createEvent(any(Event.class));
    }

    @Test
    void updateEvent_WithValidEvent_ShouldReturnUpdatedEvent() throws Exception {
        Event updatedEvent = new Event();
        updatedEvent.setTitle("Updated Event");
        updatedEvent.setType("event");
        updatedEvent.setDescription("An updated event");
        updatedEvent.setDate("2024-12-27");
        when(eventService.updateEvent(any(Event.class))).thenReturn(testEvent);
        mockMvc.perform(put("/api/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
        verify(eventService, times(1)).updateEvent(any(Event.class));
    }

    @Test
    void updateEvent_WithInvalidId_ShouldThrowException() throws Exception {
        Event updatedEvent = new Event();
        updatedEvent.setTitle("Updated Event");
        when(eventService.updateEvent(any(Event.class)))
                .thenThrow(new RuntimeException("Event not found with id: 999"));
        mockMvc.perform(put("/api/events/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEvent)))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof RuntimeException))
                .andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Event not found with id: 999")));
        verify(eventService, times(1)).updateEvent(any(Event.class));
    }

    @Test
    void deleteEvent_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(eventService).deleteEvent(1L);
        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isOk());
        verify(eventService, times(1)).deleteEvent(1L);
    }

    @Test
    void deleteEvent_WithInvalidId_ShouldThrowException() throws Exception {
        doThrow(new RuntimeException("Event not found with id: 999"))
                .when(eventService).deleteEvent(999L);
        mockMvc.perform(delete("/api/events/999"))
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof RuntimeException))
                .andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Event not found with id: 999")));
        verify(eventService, times(1)).deleteEvent(999L);
    }
} 