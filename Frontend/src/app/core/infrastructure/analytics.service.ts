import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    // In real app, send to Mixpanel/Google Analytics
    console.log(`[Analytics] ${eventName}`, properties);
  }

  trackError(error: any) {
    console.error(`[Analytics Error]`, error);
  }

  trackPageView(url: string) {
    console.log(`[Analytics PageView] ${url}`);
  }
}
