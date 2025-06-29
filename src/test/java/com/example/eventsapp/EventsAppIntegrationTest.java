package com.example.eventsapp;

import com.example.eventsapp.model.Event;
import com.example.eventsapp.model.Category;
import com.example.eventsapp.repository.EventRepository;
import com.example.eventsapp.repository.CategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
@Import(JpaConfig.class)
public class EventsAppIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private MockMvc mockMvc;
    private Category testCategory;
    private Event testEvent;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Clean up database
        eventRepository.deleteAll();
        categoryRepository.deleteAll();

        // Create test category
        testCategory = new Category();
        testCategory.setName("Test Category");
        testCategory = categoryRepository.save(testCategory);

        // Create test event
        testEvent = new Event();
        testEvent.setTitle("Test Event");
        testEvent.setType("concert");
        testEvent.setDescription("A test event for integration testing");
        testEvent.setDate("2024-12-25");
        testEvent.setImage("test-image.jpg");
        testEvent.setCategory(testCategory);
        testEvent = eventRepository.save(testEvent);
    }

    @Test
    void contextLoads() {
        // This test ensures that the Spring context loads successfully
    }

    @Test
    void getAllEvents_ShouldReturnEvents() throws Exception {
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(testEvent.getId()))
                .andExpect(jsonPath("$[0].title").value("Test Event"))
                .andExpect(jsonPath("$[0].type").value("concert"));
    }

    @Test
    void getEvent_WithValidId_ShouldReturnEvent() throws Exception {
        mockMvc.perform(get("/api/events/" + testEvent.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testEvent.getId()))
                .andExpect(jsonPath("$.title").value("Test Event"))
                .andExpect(jsonPath("$.category.id").value(testCategory.getId()));
    }

    @Test
    void getEvent_WithInvalidId_ShouldReturnError() throws Exception {
        mockMvc.perform(get("/api/events/999"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void createEvent_WithValidData_ShouldCreateAndReturnEvent() throws Exception {
        Event newEvent = new Event();
        newEvent.setTitle("New Integration Event");
        newEvent.setType("movie");
        newEvent.setDescription("A new event created through integration test");
        newEvent.setDate("2024-12-26");
        
        // Create a new category without ID to avoid detached entity error
        Category newCategory = new Category();
        newCategory.setName("New Category for Event");
        newEvent.setCategory(newCategory);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Integration Event"))
                .andExpect(jsonPath("$.type").value("movie"));
    }

    @Test
    void updateEvent_WithValidData_ShouldUpdateAndReturnEvent() throws Exception {
        Event updatedEvent = new Event();
        updatedEvent.setTitle("Updated Integration Event");
        updatedEvent.setType("event");
        updatedEvent.setDescription("An updated event through integration test");
        updatedEvent.setDate("2024-12-27");
        updatedEvent.setCategory(testCategory);

        mockMvc.perform(put("/api/events/" + testEvent.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Integration Event"));
    }

    @Test
    void deleteEvent_WithValidId_ShouldDeleteEvent() throws Exception {
        Long eventId = testEvent.getId();
        
        mockMvc.perform(delete("/api/events/" + eventId))
                .andExpect(status().isOk());

        // Verify the event was deleted by checking that it returns an error
        mockMvc.perform(get("/api/events/" + eventId))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getAllCategories_ShouldReturnCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(testCategory.getId()))
                .andExpect(jsonPath("$[0].name").value("Test Category"));
    }

    @Test
    void getCategory_WithValidId_ShouldReturnCategory() throws Exception {
        mockMvc.perform(get("/api/categories/" + testCategory.getId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testCategory.getId()))
                .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void getCategoryByName_WithValidName_ShouldReturnCategory() throws Exception {
        mockMvc.perform(get("/api/categories/name/Test Category"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(testCategory.getId()))
                .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void createCategory_WithValidData_ShouldCreateAndReturnCategory() throws Exception {
        Category newCategory = new Category();
        newCategory.setName("New Integration Category");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Integration Category"));
    }

    @Test
    void updateCategory_WithValidData_ShouldUpdateAndReturnCategory() throws Exception {
        Category updatedCategory = new Category();
        updatedCategory.setName("Updated Integration Category");

        mockMvc.perform(put("/api/categories/" + testCategory.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Integration Category"));
    }

    @Test
    void deleteCategory_WithValidId_ShouldDeleteCategory() throws Exception {
        Long categoryId = testCategory.getId();
        
        mockMvc.perform(delete("/api/categories/" + categoryId))
                .andExpect(status().isOk());

        // Verify the category was deleted by checking that it returns an error
        mockMvc.perform(get("/api/categories/" + categoryId))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void createEventWithCategory_ShouldCreateEventWithCategory() throws Exception {
        // Create event with a new category (without ID to avoid detached entity error)
        Event newEvent = new Event();
        newEvent.setTitle("Event with New Category");
        newEvent.setType("event");
        newEvent.setDescription("An event with a newly created category");
        newEvent.setDate("2024-12-28");
        
        Category newCategory = new Category();
        newCategory.setName("New Category for Event");
        newEvent.setCategory(newCategory);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Event with New Category"))
                .andExpect(jsonPath("$.category.name").value("New Category for Event"));
    }
} 