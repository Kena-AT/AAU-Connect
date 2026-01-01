import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiStore } from '../../../core/state/ui.store';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, LucideAngularModule],
  template: `
    <div class="landing-page">
      <nav class="navbar">
        <div class="logo">AAU Connect</div>
        <div class="nav-links">
          <button class="theme-toggle" (click)="ui.toggleTheme()" [title]="'Toggle Theme'">
            <lucide-icon [img]="ui.theme() === 'dark' ? SunIcon : MoonIcon"></lucide-icon>
          </button>
          <a routerLink="/login" class="nav-item">Login</a>
          <a routerLink="/signup" class="btn primary">Get Started</a>
        </div>
      </nav>
      
      <main class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            The <span class="highlight">Academic</span> Social Network
          </h1>
          <p class="hero-subtitle">
            Connect with peers, manage your courses, and stay on top of campus life. 
            All in one unified platform.
          </p>
          <div class="hero-actions">
            <a routerLink="/signup" class="btn primary lg">Join Now</a>
            <a routerLink="/login" class="btn outline lg">Log In</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card c1">
            <i class="icon">📚</i>
            <span>Course Chat</span>
          </div>
          <div class="floating-card c2">
            <i class="icon">📅</i>
            <span>Event: Hackathon</span>
          </div>
          <div class="floating-card c3">
            <i class="icon">📢</i>
            <span>Announcements</span>
          </div>
          <div class="circle-bg"></div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: var(--bg-app);
      display: flex;
      flex-direction: column;
    }
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-600);
      letter-spacing: -0.025em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-item {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-item:hover { color: var(--text-primary); }
    
    .theme-toggle {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }
    .theme-toggle:hover {
      transform: scale(1.1);
      background: var(--bg-app);
      color: var(--primary-600);
    }
    
    .hero-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem;
      gap: 4rem;
    }
    
    .hero-content {
      max-width: 500px;
    }
    .hero-title {
      font-size: 3.5rem;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }
    .highlight {
      color: var(--primary-600);
      position: relative;
    }
    .highlight::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 8px;
      background: var(--primary-100);
      z-index: -1;
      border-radius: 4px;
    }
    .hero-subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-md);
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      display: inline-block;
    }
    .btn.lg {
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }
    .btn.primary {
      background: var(--primary-600);
      color: white;
      border: 1px solid var(--primary-600);
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
    .btn.primary:hover {
      background: var(--primary-700);
      transform: translateY(-1px);
    }
    .btn.outline {
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .btn.outline:hover {
      background: var(--neutral-100);
    }
    
    .hero-visual {
      position: relative;
      width: 500px;
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .circle-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, var(--primary-50) 0%, transparent 70%);
      z-index: -1;
    }
    .floating-card {
      position: absolute;
      background: var(--bg-card);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      animation: float 6s ease-in-out infinite;
    }
    .floating-card .icon { font-style: normal; font-size: 1.5rem; }
    .c1 { top: 20%; left: 10%; animation-delay: 0s; }
    .c2 { top: 50%; right: 5%; animation-delay: 2s; }
    .c3 { bottom: 20%; left: 20%; animation-delay: 4s; }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
        padding-top: 4rem;
      }
      .hero-actions { justify-content: center; }
      .hero-visual { display: none; }
      .navbar { padding: 1rem; }
    }
  `]
})
export class LandingComponent {
  protected ui = inject(UiStore);
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
}
