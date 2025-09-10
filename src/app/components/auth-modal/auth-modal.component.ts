import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  @Input() isVisible = false;
  @Output() close = new EventEmitter<void>();

  isLogin = true;
  email = '';
  password = '';
  name = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  toggleMode(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.email = '';
    this.password = '';
    this.name = '';
    this.errorMessage = '';
    this.isLogin = true;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.isLogin) {
      this.authService.login(this.email, this.password).subscribe(
        response => {
          console.log('Login successful', response);
          this.closeModal();
        },
        error => {
          this.errorMessage = 'Invalid credentials';
        }
      );
    } else {
      this.authService.register(this.email, this.password, this.name).subscribe(
        response => {
          console.log('Registration successful', response);
          this.closeModal();
        },
        error => {
          this.errorMessage = error.error || 'Registration failed';
        }
      );
    }
  }

  onGoogleLogin(): void {
    this.authService.initiateGoogleLogin();
  }

  onFacebookLogin(): void {
    this.authService.initiateFacebookLogin();
  }
}
