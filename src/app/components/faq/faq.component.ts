import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  menuOpen = false;
  selectedCategory: any = null;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  selectCategory(category: any): void {
    this.selectedCategory = category;
  }

  goToMainPage(): void {
    this.router.navigate(['/']);
  }
}
