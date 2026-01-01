import { ValidationErrors } from '@angular/forms';

export class FormErrorMapper {
  static getMessage(label: string, errors: ValidationErrors | null): string | null {
    if (!errors) return null;

    if (errors['required']) {
      return `${label} is required`;
    }
    if (errors['email']) {
      return `Please enter a valid email`;
    }
    if (errors['minlength']) {
      return `${label} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['pattern']) {
      return `${label} format is invalid`;
    }

    return `${label} is invalid`;
  }
}
