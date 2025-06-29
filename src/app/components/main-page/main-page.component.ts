import { Component, OnInit } from '@angular/core';
import { EventsListComponent } from '../events-list/events-list.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  showChat = false;
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  loading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  selectCategory(category: Category | null): void {
    this.selectedCategory = category;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  onEventAdded(): void {
    // This will be called when an event is added through chat
    // We can refresh the events list here if needed
  }
} 