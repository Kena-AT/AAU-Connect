import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { UserRole } from '../../core/models/user.model';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);

  private requiredRole: UserRole | null = null;

  @Input() set appHasPermission(role: UserRole) {
    this.requiredRole = role;
    this.updateView();
  }

  constructor() {
    effect(() => {
      // Re-run when user changes
      this.auth.currentUser();
      this.updateView();
    });
  }

  private updateView() {
    const userRole = this.auth.currentUser()?.role;

    // Simple hierarchy check or strict match
    // For MVP, strict match or "at least"? 
    // Let's do strict match or simple logic for now.
    // Ideally AuthService has checkPermission(role).

    if (this.requiredRole && userRole === this.requiredRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (!this.requiredRole) {
      // If no role specified, maybe show? Or hide?
      this.viewContainer.clear();
    } else {
      this.viewContainer.clear();
    }
  }
}
