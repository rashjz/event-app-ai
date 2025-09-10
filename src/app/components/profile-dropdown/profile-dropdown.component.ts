import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.css']
})
export class ProfileDropdownComponent {
  @Input() user: User | null = null;
  @Output() logout = new EventEmitter<void>();

  isDropdownOpen = false;

  constructor(private authService: AuthService) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onLogout(): void {
    this.authService.logout();
    this.logout.emit();
    this.isDropdownOpen = false;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}
