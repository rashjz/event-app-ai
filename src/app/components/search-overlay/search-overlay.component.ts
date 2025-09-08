import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.css']
})
export class SearchOverlayComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  searchControl = new FormControl('');
  searchResults: Event[] = [];
  autocompleteSuggestions: string[] = [];
  isLoading = false;
  hasError = false;
  noResults = false;
  showSuggestions = false;

  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query && query.length > 2) {
          this.performSearch(query);
          this.getAutocompleteSuggestions(query);
        } else {
          this.clearResults();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  performSearch(query: string | null): void {
    if (!query || query.trim() === '') {
      this.clearResults();
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.noResults = false;

    this.searchService.searchEvents(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.noResults = results.length === 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  getAutocompleteSuggestions(query: string): void {
    this.searchService.getAutocompleteSuggestions(query).subscribe({
      next: (suggestions) => {
        this.autocompleteSuggestions = suggestions;
        this.showSuggestions = suggestions.length > 0;
      },
      error: (error) => {
        console.error('Autocomplete error:', error);
        this.showSuggestions = false;
      }
    });
  }

  selectSuggestion(suggestion: string): void {
    this.searchControl.setValue(suggestion);
    this.showSuggestions = false;
    this.performSearch(suggestion);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.clearResults();
  }

  clearResults(): void {
    this.searchResults = [];
    this.autocompleteSuggestions = [];
    this.showSuggestions = false;
    this.noResults = false;
    this.hasError = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeOverlay();
    } else if (event.key === 'Enter') {
      const query = this.searchControl.value;
      if (query) {
        this.performSearch(query);
      }
    }
  }

  closeOverlay(): void {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
