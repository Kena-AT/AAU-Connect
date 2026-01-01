import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleSwitchComponent),
    multi: true
  }],
  template: `
    <label class="toggle-container" [class.disabled]="disabled">
      <input 
        type="checkbox" 
        [checked]="value"
        [disabled]="disabled"
        (change)="onToggle($event)"
        class="toggle-input"
        [attr.aria-label]="label" />
      <span class="toggle-slider"></span>
      @if (label) {
        <span class="toggle-label">{{ label }}</span>
      }
    </label>
  `,
  styles: [`
    .toggle-container {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      cursor: pointer;
      user-select: none;
    }

    .toggle-container.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .toggle-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: relative;
      width: 48px;
      height: 26px;
      background: var(--neutral-300);
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      left: 3px;
      top: 3px;
      background: white;
      border-radius: var(--radius-full);
      transition: all var(--transition-bounce);
      box-shadow: var(--shadow-md);
    }

    .toggle-input:checked + .toggle-slider {
      background: var(--gradient-primary);
      box-shadow: var(--shadow-md);
    }

    .toggle-input:checked + .toggle-slider::before {
      transform: translateX(22px);
    }

    .toggle-input:focus-visible + .toggle-slider {
      outline: 2px solid var(--primary-500);
      outline-offset: 2px;
    }

    .toggle-label {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
    }

    .toggle-container:hover .toggle-slider {
      transform: scale(1.05);
    }
  `]
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<boolean>();

  value = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  onToggle(event: Event) {
    if (this.disabled) return;

    const checked = (event.target as HTMLInputElement).checked;
    this.value = checked;
    this.onChange(checked);
    this.onTouched();
    this.valueChange.emit(checked);
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
