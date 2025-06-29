import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  isAdding = false;
  isEditing = false;
  selectedCategory: Category | null = null;
  newCategory: Category = { name: '', description: '', color: '#3498db' };

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  addCategory(): void {
    this.isAdding = true;
    this.isEditing = false;
    this.newCategory = { name: '', description: '', color: '#3498db' };
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.isAdding = false;
    this.selectedCategory = { ...category };
  }

  saveCategory(): void {
    if (this.isAdding) {
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (category) => {
          this.categories.push(category);
          this.cancel();
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    } else if (this.isEditing && this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id!, this.selectedCategory).subscribe({
        next: (category) => {
          const index = this.categories.findIndex(c => c.id === category.id);
          if (index !== -1) {
            this.categories[index] = category;
          }
          this.cancel();
        },
        error: (error) => {
          console.error('Error updating category:', error);
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }

  cancel(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedCategory = null;
    this.newCategory = { name: '', description: '', color: '#3498db' };
  }
} 