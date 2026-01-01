import { Injectable, signal } from '@angular/core';

// Default flags
export const defaultFlags = {
  enableAiModeration: false,
  enableRealtime: true,
  enableCommandPalette: true
};

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private _flags = signal(defaultFlags);

  readonly flags = this._flags.asReadonly();

  isEnabled(flag: keyof typeof defaultFlags): boolean {
    return this._flags()[flag];
  }

  // TODO: Load from API or Environment on init
  initialize(envFlags: Partial<typeof defaultFlags>) {
    this._flags.update(current => ({ ...current, ...envFlags }));
  }
}
