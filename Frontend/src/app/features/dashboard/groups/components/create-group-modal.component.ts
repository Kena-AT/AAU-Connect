import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Target, BookOpen, Globe, Lock, Mail, X, GraduationCap } from 'lucide-angular';
import { GroupStore } from '../../../../core/state/group.store';
import { GroupType, GroupVisibility, CreateGroupDto } from '../../../../core/models/group.model';

@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="modal-overlay" (click)="close.emit()">
      <div class="modal-content glass-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <h2>Create New Group</h2>
          <button class="btn-close" (click)="close.emit()">
            <lucide-icon [img]="XIcon"></lucide-icon>
          </button>
        </div>

        <!-- Progress Steps -->
        <div class="steps-indicator">
          <div class="step" [class.active]="currentStep() >= 1" [class.completed]="currentStep() > 1">
            <div class="step-number">1</div>
            <span>Type</span>
          </div>
          <div class="step-line" [class.completed]="currentStep() > 1"></div>
          <div class="step" [class.active]="currentStep() >= 2" [class.completed]="currentStep() > 2">
            <div class="step-number">2</div>
            <span>Details</span>
          </div>
          <div class="step-line" [class.completed]="currentStep() > 2"></div>
          <div class="step" [class.active]="currentStep() >= 3">
            <div class="step-number">3</div>
            <span>Privacy</span>
          </div>
        </div>

        <!-- Form -->
        <form [formGroup]="createForm" (ngSubmit)="onSubmit()">
          <!-- Step 1: Select Type -->
          @if (currentStep() === 1) {
            <div class="form-step">
              <h3>Select Group Type</h3>
              <p class="step-description">Choose the type of group you want to create</p>
              
              <div class="type-grid">
                @for (type of availableTypes; track type.value) {
                  <div 
                    class="type-card" 
                    [class.selected]="createForm.get('type')?.value === type.value"
                    (click)="createForm.patchValue({ type: type.value })">
                    <div class="type-icon-wrapper">
                      <lucide-icon [img]="type.icon" class="type-icon"></lucide-icon>
                    </div>
                    <h4>{{ type.label }}</h4>
                    <p>{{ type.description }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Step 2: Details -->
          @if (currentStep() === 2) {
            <div class="form-step">
              <h3>Group Details</h3>
              <p class="step-description">Tell us about your group</p>

              <div class="form-group">
                <label>Group Name *</label>
                <input 
                  type="text" 
                  formControlName="name" 
                  placeholder="e.g., CS 301 Study Group"
                  class="form-input" />
                @if (createForm.get('name')?.touched && createForm.get('name')?.errors) {
                  <span class="error">Group name is required</span>
                }
              </div>

              <div class="form-group">
                <label>Description *</label>
                <textarea 
                  formControlName="description" 
                  placeholder="Describe the purpose of this group..."
                  rows="4"
                  class="form-input"></textarea>
                @if (createForm.get('description')?.touched && createForm.get('description')?.errors) {
                  <span class="error">Description is required</span>
                }
              </div>
            </div>
          }

          <!-- Step 3: Privacy -->
          @if (currentStep() === 3) {
            <div class="form-step">
              <h3>Privacy Settings</h3>
              <p class="step-description">Who can join this group?</p>

              <div class="privacy-options">
                @for (option of privacyOptions; track option.value) {
                  <div 
                    class="privacy-card"
                    [class.selected]="createForm.get('visibility')?.value === option.value"
                    (click)="createForm.patchValue({ visibility: option.value })">
                    <div class="privacy-header">
                      <lucide-icon [img]="option.icon" class="privacy-icon"></lucide-icon>
                      <h4>{{ option.label }}</h4>
                    </div>
                    <p>{{ option.description }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Actions -->
          <div class="modal-actions">
            @if (currentStep() > 1) {
              <button type="button" class="btn-secondary" (click)="previousStep()">
                Back
              </button>
            }
            @if (currentStep() < 3) {
              <button type="button" class="btn-primary" (click)="nextStep()" [disabled]="!canProceed()">
                Next
              </button>
            } @else {
              <button type="submit" class="btn-primary" [disabled]="createForm.invalid || groupStore.loading()">
                {{ groupStore.loading() ? 'Creating...' : 'Create Group' }}
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: var(--space-4);
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-6);
      border-bottom: 1px solid var(--border-glass);
    }

    .modal-header h2 {
      font-size: var(--text-2xl);
      font-weight: 700;
      margin: 0;
    }

    .btn-close {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-glass);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-close lucide-icon {
      width: 20px;
      height: 20px;
    }

    .btn-close:hover {
      background: var(--danger-500);
      color: white;
      transform: rotate(90deg);
    }

    /* Steps Indicator */
    .steps-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
      gap: var(--space-2);
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--bg-glass);
      border: 2px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: var(--gradient-primary);
      border-color: transparent;
      color: white;
    }

    .step.completed .step-number {
      background: var(--success-500);
      border-color: transparent;
      color: white;
    }

    .step span {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-weight: 500;
    }

    .step-line {
      width: 60px;
      height: 2px;
      background: var(--border-glass);
      transition: all 0.3s ease;
    }

    .step-line.completed {
      background: var(--success-500);
    }

    /* Form Steps */
    .form-step {
      padding: var(--space-6);
      min-height: 300px;
    }

    .form-step h3 {
      font-size: var(--text-xl);
      font-weight: 700;
      margin: 0 0 var(--space-2) 0;
    }

    .step-description {
      color: var(--text-secondary);
      margin: 0 0 var(--space-6) 0;
    }

    /* Type Grid */
    .type-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .type-card {
      padding: var(--space-5);
      border: 2px solid var(--border-glass);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .type-card:hover {
      border-color: var(--primary-500);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .type-card.selected {
      border-color: var(--primary-500);
      background: rgba(99, 102, 241, 0.1);
    }

    .type-icon-wrapper {
      width: 56px;
      height: 56px;
      margin: 0 auto var(--space-4);
      background: var(--bg-glass);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-500);
      transition: all 0.3s ease;
    }

    .type-card:hover .type-icon-wrapper,
    .type-card.selected .type-icon-wrapper {
      background: var(--gradient-primary);
      color: white;
      transform: scale(1.1);
    }

    .type-icon {
      width: 28px;
      height: 28px;
    }

    .type-card h4 {
      font-size: var(--text-base);
      font-weight: 600;
      margin: 0 0 var(--space-2) 0;
    }

    .type-card p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    /* Form Group */
    .form-group {
      margin-bottom: var(--space-5);
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: var(--space-2);
      color: var(--text-primary);
    }

    .form-input {
      width: 100%;
      padding: var(--space-3);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      background: var(--bg-glass);
      color: var(--text-primary);
      font-family: inherit;
      font-size: var(--text-base);
      transition: all 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    textarea.form-input {
      resize: vertical;
      min-height: 100px;
    }

    .error {
      display: block;
      color: var(--danger-500);
      font-size: var(--text-xs);
      margin-top: var(--space-1);
    }

    /* Privacy Options */
    .privacy-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .privacy-card {
      padding: var(--space-4);
      border: 2px solid var(--border-glass);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .privacy-card:hover {
      border-color: var(--primary-500);
      transform: translateX(4px);
    }

    .privacy-card.selected {
      border-color: var(--primary-500);
      background: rgba(99, 102, 241, 0.1);
    }

    .privacy-header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }

    .privacy-icon {
      width: 24px;
      height: 24px;
      color: var(--primary-500);
    }

    .privacy-card h4 {
      font-size: var(--text-base);
      font-weight: 600;
      margin: 0;
    }

    .privacy-card p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-6);
      border-top: 1px solid var(--border-glass);
    }

    .btn-secondary, .btn-primary {
      flex: 1;
      padding: var(--space-3) var(--space-6);
      border: none;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: var(--text-base);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary {
      background: var(--bg-glass);
      color: var(--text-primary);
      border: 1px solid var(--border-glass);
    }

    .btn-secondary:hover {
      background: var(--bg-card);
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class CreateGroupModalComponent {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  groupStore = inject(GroupStore);

  currentStep = signal(1);

  readonly XIcon = X;

  createForm = this.fb.group({
    type: ['club' as GroupType, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    visibility: ['public' as GroupVisibility, Validators.required]
  });

  availableTypes = [
    {
      value: 'club' as GroupType,
      label: 'Club',
      icon: Target,
      description: 'Interest-based community group'
    },
    {
      value: 'study' as GroupType,
      label: 'Study Group',
      icon: BookOpen,
      description: 'Collaborative learning group'
    },
    {
      value: 'class' as GroupType,
      label: 'Class',
      icon: GraduationCap,
      description: 'Course or section group (e.g. Section 4 SITE)'
    }
  ];

  privacyOptions = [
    {
      value: 'public' as GroupVisibility,
      label: 'Public',
      icon: Globe,
      description: 'Anyone can find and join this group'
    },
    {
      value: 'private' as GroupVisibility,
      label: 'Private',
      icon: Lock,
      description: 'Members must request to join'
    },
    {
      value: 'invite-only' as GroupVisibility,
      label: 'Invite Only',
      icon: Mail,
      description: 'Only invited members can join'
    }
  ];

  nextStep() {
    if (this.canProceed()) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep() {
    this.currentStep.update(s => s - 1);
  }

  canProceed(): boolean {
    const step = this.currentStep();
    if (step === 1) {
      return !!this.createForm.get('type')?.value;
    }
    if (step === 2) {
      return !!(this.createForm.get('name')?.valid && this.createForm.get('description')?.valid);
    }
    return true;
  }

  onSubmit() {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;
      const dto: CreateGroupDto = {
        name: formValue.name!,
        description: formValue.description!,
        type: formValue.type!,
        visibility: formValue.visibility!
      };

      this.groupStore.createGroup(dto);
      this.close.emit();
    }
  }
}
