import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string | null;
  name: string | null;
  provider: string;
  profilePictureUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for token in localStorage first
    const token = localStorage.getItem('token');
    if (token) {
      this.loadCurrentUser();
    }
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/me`, { headers });
  }

  loadCurrentUser(): void {
    this.getCurrentUser().subscribe(
      user => this.currentUserSubject.next(user),
      error => {
        console.error('Failed to load current user', error);
        this.logout();
      }
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // OAuth methods
  initiateGoogleLogin(): void {
    window.location.href = '/oauth2/authorization/google';
  }

  initiateFacebookLogin(): void {
    window.location.href = '/oauth2/authorization/facebook';
  }

  handleOAuthSuccess(token: string): Observable<User> {
    localStorage.setItem('token', token);
    return this.getCurrentUser().pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  checkForOAuthCallback(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Remove token from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.pathname + url.hash);

      // Store token and fetch user info
      localStorage.setItem('token', token);
      this.loadCurrentUser();
    }
  }
}
