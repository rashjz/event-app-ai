import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { QuillModule } from 'ngx-quill';
import { AuthInterceptor } from './services/auth.interceptor';

import { AppComponent } from './app.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { ChatComponent } from './components/chat/chat.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AdminComponent } from './components/admin/admin.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { FaqComponent } from './components/faq/faq.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { SearchOverlayComponent } from './components/search-overlay/search-overlay.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { ProfileDropdownComponent } from './components/profile-dropdown/profile-dropdown.component';
import { SharedNavbarComponent } from './components/shared-navbar/shared-navbar.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    EventsListComponent,
    EventDetailComponent,
    ChatComponent,
    MainPageComponent,
    AdminComponent,
    CategoryManagementComponent,
    FaqComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    SearchOverlayComponent,
    AuthModalComponent,
    ProfileDropdownComponent,
    SharedNavbarComponent,
    StarRatingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    QuillModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
