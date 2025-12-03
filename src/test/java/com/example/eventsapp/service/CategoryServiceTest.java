package com.example.eventsapp.service;

import com.example.eventsapp.model.Category;
import com.example.eventsapp.repository.CategoryRepository;
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
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Music");
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        // Arrange
        List<Category> expectedCategories = Arrays.asList(testCategory);
        when(categoryRepository.findAll()).thenReturn(expectedCategories);

        // Act
        List<Category> actualCategories = categoryService.getAllCategories();

        // Assert
        assertEquals(expectedCategories, actualCategories);
        assertEquals(1, actualCategories.size());
        assertEquals("Music", actualCategories.get(0).getName());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getCategory_WithValidId_ShouldReturnCategory() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));

        // Act
        Category actualCategory = categoryService.getCategory(1L);

        // Assert
        assertEquals(testCategory, actualCategory);
        assertEquals("Music", actualCategory.getName());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void getCategory_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.getCategory(999L);
        });

        assertEquals("Category not found with id: 999", exception.getMessage());
        verify(categoryRepository, times(1)).findById(999L);
    }

    @Test
    void getCategoryByName_WithValidName_ShouldReturnCategory() {
        // Arrange
        when(categoryRepository.findByName("Music")).thenReturn(Optional.of(testCategory));

        // Act
        Category actualCategory = categoryService.getCategoryByName("Music");

        // Assert
        assertEquals(testCategory, actualCategory);
        assertEquals("Music", actualCategory.getName());
        verify(categoryRepository, times(1)).findByName("Music");
    }

    @Test
    void getCategoryByName_WithInvalidName_ShouldThrowException() {
        // Arrange
        when(categoryRepository.findByName("InvalidCategory")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.getCategoryByName("InvalidCategory");
        });

        assertEquals("Category not found with name: InvalidCategory", exception.getMessage());
        verify(categoryRepository, times(1)).findByName("InvalidCategory");
    }

    @Test
    void createCategory_WithValidCategory_ShouldReturnSavedCategory() {
        // Arrange
        Category newCategory = new Category();
        newCategory.setName("New Category");

        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category savedCategory = categoryService.createCategory(newCategory);

        // Assert
        assertEquals(testCategory, savedCategory);
        assertEquals("Music", savedCategory.getName());
        verify(categoryRepository, times(1)).save(newCategory);
    }

    @Test
    void updateCategory_WithValidCategory_ShouldReturnUpdatedCategory() {
        // Arrange
        Category updatedCategory = new Category();
        updatedCategory.setId(1L);
        updatedCategory.setName("Updated Music");

        when(categoryRepository.existsById(1L)).thenReturn(true);
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category result = categoryService.updateCategory(updatedCategory);

        // Assert
        assertEquals(testCategory, result);
        verify(categoryRepository, times(1)).existsById(1L);
        verify(categoryRepository, times(1)).save(updatedCategory);
    }

    @Test
    void updateCategory_WithInvalidId_ShouldThrowException() {
        // Arrange
        Category updatedCategory = new Category();
        updatedCategory.setId(999L);
        updatedCategory.setName("Updated Category");

        when(categoryRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.updateCategory(updatedCategory);
        });

        assertEquals("Category not found with id: 999", exception.getMessage());
        verify(categoryRepository, times(1)).existsById(999L);
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void deleteCategory_WithValidId_ShouldDeleteCategory() {
        // Arrange
        when(categoryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(categoryRepository).deleteById(1L);

        // Act
        categoryService.deleteCategory(1L);

        // Assert
        verify(categoryRepository, times(1)).existsById(1L);
        verify(categoryRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteCategory_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(categoryRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            categoryService.deleteCategory(999L);
        });

        assertEquals("Category not found with id: 999", exception.getMessage());
        verify(categoryRepository, times(1)).existsById(999L);
        verify(categoryRepository, never()).deleteById(any(Long.class));
    }

    @Test
    void createCategory_WithNullCategory_ShouldHandleGracefully() {
        // Arrange
        when(categoryRepository.save(null)).thenThrow(new IllegalArgumentException("Category cannot be null"));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(null);
        });

        verify(categoryRepository, times(1)).save(null);
    }

    @Test
    void getAllCategories_WhenRepositoryReturnsEmptyList_ShouldReturnEmptyList() {
        // Arrange
        when(categoryRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Category> actualCategories = categoryService.getAllCategories();

        // Assert
        assertTrue(actualCategories.isEmpty());
        verify(categoryRepository, times(1)).findAll();
    }
} 