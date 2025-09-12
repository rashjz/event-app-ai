import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { Rating } from '../../models/rating';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {
  @Input() eventId!: number;
  @Input() readonly: boolean = false;
  @Input() showStats: boolean = true;
  @Output() ratingSubmitted = new EventEmitter<any>();

  stars: number[] = [1, 2, 3, 4, 5];
  userRating: number = 0;
  averageRating: number = 0;
  ratingCount: number = 0;
  hoverStar: number = 0;
  isLoading: boolean = false;
  isLoggedIn: boolean = false;

  constructor(
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.loadRatingStats();
    if (this.isLoggedIn && !this.readonly) {
      this.loadUserRating();
    }
  }

  loadRatingStats(): void {
    this.ratingService.getRatingStats(this.eventId).subscribe({
      next: (stats) => {
        this.averageRating = stats.averageRating;
        this.ratingCount = stats.ratingCount;
      },
      error: (error) => {
        console.error('Error loading rating stats:', error);
      }
    });
  }

  loadUserRating(): void {
    this.ratingService.getUserRating(this.eventId).subscribe({
      next: (rating) => {
        if (rating) {
          this.userRating = rating.ratingValue;
        }
      },
      error: (error) => {
        console.error('Error loading user rating:', error);
      }
    });
  }

  rate(ratingValue: number): void {
    if (!this.isLoggedIn || this.readonly) {
      return;
    }

    this.isLoading = true;
    this.ratingService.submitRating(this.eventId, ratingValue).subscribe({
      next: (response) => {
        this.userRating = ratingValue;
        this.averageRating = response.averageRating;
        this.ratingCount = response.ratingCount;
        this.ratingSubmitted.emit(response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        this.isLoading = false;
      }
    });
  }

  isStarActive(starValue: number): boolean {
    return starValue <= this.userRating;
  }

  getRatingText(): string {
    if (this.ratingCount === 0) {
      return 'No ratings yet';
    }
    return `${this.averageRating.toFixed(1)} stars from ${this.ratingCount} rating${this.ratingCount !== 1 ? 's' : ''}`;
  }
}
