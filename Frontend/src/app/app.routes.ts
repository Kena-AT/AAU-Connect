import { Routes } from '@angular/router';
import { verifiedStudentGuard } from './core/guards/verified-student.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [verifiedStudentGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', loadComponent: () => import('./features/dashboard/feed/feed.component').then(m => m.FeedComponent) },
      { path: 'messaging', loadComponent: () => import('./features/dashboard/messaging/messaging.component').then(m => m.MessagingComponent) },
      { path: 'groups', loadComponent: () => import('./features/dashboard/groups/groups-page.component').then(m => m.GroupsPageComponent) },
      { path: 'groups/:id', loadComponent: () => import('./features/dashboard/groups/group-detail/group-detail.component').then(m => m.GroupDetailComponent) },
      { path: 'events', loadComponent: () => import('./features/dashboard/events/events.component').then(m => m.EventsComponent) },
      { path: 'settings', loadComponent: () => import('./features/dashboard/settings/settings-page.component').then(m => m.SettingsPageComponent) },
      { path: 'search', loadComponent: () => import('./features/dashboard/search/search.component').then(m => m.SearchComponent) },
      { path: 'profile/:id', loadComponent: () => import('./features/dashboard/profile/profile-page.component').then(m => m.ProfilePageComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
