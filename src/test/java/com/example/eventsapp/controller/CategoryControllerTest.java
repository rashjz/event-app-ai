package com.example.eventsapp.controller;

import com.example.eventsapp.model.Category;
import com.example.eventsapp.service.CategoryService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = CategoryController.class)
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Music");
    }

    @Test
    void getAllCategories_ShouldReturnCategoriesList() throws Exception {
        List<Category> categories = Arrays.asList(testCategory);
        when(categoryService.getAllCategories()).thenReturn(categories);
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Music"));
        verify(categoryService, times(1)).getAllCategories();
    }

    @Test
    void getCategory_WithValidId_ShouldReturnCategory() throws Exception {
        when(categoryService.getCategory(1L)).thenReturn(testCategory);
        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Music"));
        verify(categoryService, times(1)).getCategory(1L);
    }

    @Test
    void getCategory_WithInvalidId_ShouldThrowException() throws Exception {
        when(categoryService.getCategory(999L)).thenThrow(new RuntimeException("Category not found with id: 999"));
        mockMvc.perform(get("/api/categories/999"))
                .andExpect(status().isInternalServerError());
        verify(categoryService, times(1)).getCategory(999L);
    }

    @Test
    void getCategoryByName_WithValidName_ShouldReturnCategory() throws Exception {
        when(categoryService.getCategoryByName("Music")).thenReturn(testCategory);
        mockMvc.perform(get("/api/categories/name/Music"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Music"));
        verify(categoryService, times(1)).getCategoryByName("Music");
    }

    @Test
    void getCategoryByName_WithInvalidName_ShouldThrowException() throws Exception {
        when(categoryService.getCategoryByName("InvalidCategory")).thenThrow(new RuntimeException("Category not found with name: InvalidCategory"));
        mockMvc.perform(get("/api/categories/name/InvalidCategory"))
                .andExpect(status().isInternalServerError());
        verify(categoryService, times(1)).getCategoryByName("InvalidCategory");
    }

    @Test
    void createCategory_WithValidCategory_ShouldReturnCreatedCategory() throws Exception {
        Category newCategory = new Category();
        newCategory.setName("New Category");
        when(categoryService.createCategory(any(Category.class))).thenReturn(testCategory);
        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Music"));
        verify(categoryService, times(1)).createCategory(any(Category.class));
    }

    @Test
    void updateCategory_WithValidCategory_ShouldReturnUpdatedCategory() throws Exception {
        Category updatedCategory = new Category();
        updatedCategory.setName("Updated Category");
        when(categoryService.updateCategory(any(Category.class))).thenReturn(testCategory);
        mockMvc.perform(put("/api/categories/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCategory)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
        verify(categoryService, times(1)).updateCategory(any(Category.class));
    }

    @Test
    void updateCategory_WithInvalidId_ShouldThrowException() throws Exception {
        Category updatedCategory = new Category();
        updatedCategory.setName("Updated Category");
        when(categoryService.updateCategory(any(Category.class)))
                .thenThrow(new RuntimeException("Category not found with id: 999"));
        mockMvc.perform(put("/api/categories/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCategory)))
                .andExpect(status().isInternalServerError());
        verify(categoryService, times(1)).updateCategory(any(Category.class));
    }

    @Test
    void deleteCategory_WithValidId_ShouldReturnNoContent() throws Exception {
        doNothing().when(categoryService).deleteCategory(1L);
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isOk());
        verify(categoryService, times(1)).deleteCategory(1L);
    }

    @Test
    void deleteCategory_WithInvalidId_ShouldThrowException() throws Exception {
        doThrow(new RuntimeException("Category not found with id: 999"))
                .when(categoryService).deleteCategory(999L);
        mockMvc.perform(delete("/api/categories/999"))
                .andExpect(status().isInternalServerError());
        verify(categoryService, times(1)).deleteCategory(999L);
    }
} 