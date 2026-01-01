import { Component, inject, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Image, Send, ArrowLeft, Camera, MapPin, Tag, SlidersHorizontal, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-create-post-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              @if (step() > 1) {
                <button class="btn-icon" (click)="prevStep()">
                  <lucide-icon [img]="ArrowLeftIcon"></lucide-icon>
                </button>
              }
            </div>
            <h2>{{ stepTitle() }}</h2>
            <div class="header-right">
              @if (step() === 3) {
                <button class="btn-text" (click)="onSubmit()" [disabled]="postForm.invalid">
                  Share
                </button>
              } @else if (step() === 2) {
                <button class="btn-text" (click)="nextStep()">
                  Next
                </button>
              } @else {
                <button class="btn-icon" (click)="close()">
                  <lucide-icon [img]="CloseIcon"></lucide-icon>
                </button>
              }
            </div>
          </div>

          <div class="modal-body">
            <!-- Step 1: Select Media -->
            @if (step() === 1) {
              <div class="step-media-select">
                <div class="upload-zone" (click)="fileInput.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event)">
                  <div class="upload-icon-circle">
                    <lucide-icon [img]="MediaIcon" class="icon-lg"></lucide-icon>
                  </div>
                  <h3>Drag photos and videos here</h3>
                  <button class="btn-primary">Select from computer</button>
                  <input 
                    #fileInput 
                    type="file" 
                    accept="image/*,video/*" 
                    (change)="onMediaSelected($event)"
                    style="display: none" />
                </div>
              </div>
            }

            <!-- Step 2: Edit Media -->
            @if (step() === 2) {
              <div class="step-edit">
                <div class="preview-container">
                  <img [src]="currentMedia()" [style.filter]="filterString()" alt="Preview" />
                </div>
                <div class="filters-panel">
                  <div class="filter-header">
                    <lucide-icon [img]="SlidersIcon" class="icon-sm"></lucide-icon>
                    <span>Adjustments</span>
                  </div>
                  <div class="filter-control">
                    <label>Brightness</label>
                    <input type="range" min="50" max="150" [formControl]="brightnessControl" />
                  </div>
                  <div class="filter-control">
                    <label>Contrast</label>
                    <input type="range" min="50" max="150" [formControl]="contrastControl" />
                  </div>
                  <div class="filter-control">
                    <label>Saturation</label>
                    <input type="range" min="0" max="200" [formControl]="saturationControl" />
                  </div>
                </div>
              </div>
            }

            <!-- Step 3: Details -->
            @if (step() === 3) {
              <div class="step-details">
                <div class="details-layout">
                  <div class="mini-preview">
                    <img [src]="currentMedia()" [style.filter]="filterString()" alt="Thumbnail" />
                  </div>
                  <form [formGroup]="postForm" class="details-form">
                    <div class="form-group">
                      <textarea 
                        formControlName="caption" 
                        class="caption-input" 
                        placeholder="Write a caption..."
                        rows="4"></textarea>
                    </div>
                    
                    <div class="add-ons">
                      <div class="add-on-item">
                        <input formControlName="location" placeholder="Add Location" class="addon-input" />
                        <lucide-icon [img]="MapPinIcon" class="addon-icon"></lucide-icon>
                      </div>
                      <div class="add-on-item">
                        <input formControlName="tags" placeholder="Tag People" class="addon-input" />
                        <lucide-icon [img]="TagIcon" class="addon-icon"></lucide-icon>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      width: 90%;
      max-width: 800px;
      height: 80vh; /* Fixed height for wizard feel */
      max-height: 700px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bg-card);
      border-radius: var(--radius-2xl);
      animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes zoomIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Header */
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-glass);
      height: 60px;
    }

    .modal-header h2 {
      font-size: var(--text-lg);
      font-weight: 700;
      margin: 0;
      flex: 1;
      text-align: center;
    }

    .header-left, .header-right {
      width: 60px; /* Balance the header */
      display: flex;
      justify-content: center;
    }

    .header-right {
      justify-content: flex-end;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-primary);
      padding: var(--space-2);
      border-radius: var(--radius-full);
      transition: background 0.2s;
    }

    .btn-icon:hover {
      background: var(--bg-glass);
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--primary-600);
      font-weight: 700;
      font-size: var(--text-base);
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-text:hover {
      color: var(--primary-500);
    }

    .btn-text:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Body */
    .modal-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    /* Step 1: Media Select */
    .step-media-select {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-zone {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-5);
      padding: var(--space-10);
    }

    .upload-icon-circle {
      width: 96px;
      height: 96px;
      border-radius: var(--radius-full);
      background: var(--bg-glass);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-2);
    }

    .icon-lg {
      width: 48px;
      height: 48px;
    }

    .btn-primary {
      background: var(--primary-600);
      color: white;
      border: none;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-lg);
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    /* Step 2: Edit */
    .step-edit {
      height: 100%;
      display: flex;
      flex-direction: column; /* Stack vertically on small screens */
    }

    .preview-container {
      flex: 1;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .preview-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .filters-panel {
      padding: var(--space-6);
      border-top: 1px solid var(--border-glass);
      background: var(--bg-card);
    }

    .filter-control {
      margin-bottom: var(--space-4);
    }

    .filter-control label {
      display: block;
      font-size: var(--text-sm);
      font-weight: 600;
      margin-bottom: var(--space-2);
      color: var(--text-secondary);
    }

    .filter-control input[type="range"] {
      width: 100%;
      accent-color: var(--primary-600);
    }

    @media (min-width: 768px) {
      .step-edit {
        flex-direction: row;
      }
      .filters-panel {
        width: 300px;
        border-top: none;
        border-left: 1px solid var(--border-glass);
      }
    }

    /* Step 3: Details */
    .step-details {
      height: 100%;
    }

    .details-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .mini-preview {
      display: none; /* Hidden on mobile details view usually, or shown small */
    }

    .details-form {
      padding: var(--space-4);
      flex: 1;
    }

    .caption-input {
      width: 100%;
      border: none;
      background: transparent;
      font-size: var(--text-lg);
      font-family: inherit;
      resize: none;
      color: var(--text-primary);
    }

    .caption-input:focus {
      outline: none;
    }

    .add-ons {
      margin-top: var(--space-4);
      border-top: 1px solid var(--border-glass);
    }

    .add-on-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0;
      border-bottom: 1px solid var(--border-glass);
    }

    .addon-input {
      border: none;
      background: transparent;
      font-size: var(--text-base);
      color: var(--text-primary);
      flex: 1;
    }
    
    .addon-input:focus {
      outline: none;
    }

    .addon-icon {
      color: var(--text-secondary);
    }

    @media (min-width: 768px) {
      .details-layout {
        flex-direction: row;
      }
      .mini-preview {
        display: flex;
        width: 60%;
        background: #000;
        align-items: center;
        justify-content: center;
      }
      .mini-preview img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .details-form {
        width: 40%;
        border-left: 1px solid var(--border-glass);
        padding: var(--space-6);
      }
    }
  `]
})
export class CreatePostModalComponent {
  private fb = inject(FormBuilder);

  readonly CloseIcon = X;
  readonly MediaIcon = Image; // Or multiple images icon
  readonly ArrowLeftIcon = ArrowLeft;
  readonly SlidersIcon = SlidersHorizontal;
  readonly MapPinIcon = MapPin;
  readonly TagIcon = Tag;

  isOpen = signal(false);
  step = signal(1); // 1: Media, 2: Edit, 3: Details

  currentMedia = signal<string | null>(null);
  selectedFile: File | null = null;

  // Edit Controls
  brightnessControl = this.fb.control(100);
  contrastControl = this.fb.control(100);
  saturationControl = this.fb.control(100);

  postForm = this.fb.group({
    caption: ['', Validators.required],
    location: [''],
    tags: ['']
  });

  @Output() postCreated = new EventEmitter<any>();

  stepTitle = computed(() => {
    switch (this.step()) {
      case 1: return 'Create new post';
      case 2: return 'Edit';
      case 3: return 'New Post';
      default: return 'Create';
    }
  });

  filterString = computed(() => {
    return `brightness(${this.brightnessControl.value}%) contrast(${this.contrastControl.value}%) saturate(${this.saturationControl.value}%)`;
  });

  open() {
    this.isOpen.set(true);
    this.resetState();
  }

  close() {
    this.isOpen.set(false);
    this.resetState();
  }

  resetState() {
    this.step.set(1);
    this.currentMedia.set(null);
    this.selectedFile = null;
    this.postForm.reset();
    this.brightnessControl.setValue(100);
    this.contrastControl.setValue(100);
    this.saturationControl.setValue(100);
  }

  nextStep() {
    if (this.step() < 3) {
      this.step.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
    }
  }

  onMediaSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.handleFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    this.handleFile(file);
  }

  handleFile(file: File | undefined | null) {
    if (file) {
      // Validate type/size if needed
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.currentMedia.set(e.target?.result as string);
        this.nextStep(); // Auto advance to edit
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      const post = {
        media: this.currentMedia(), // Ideally this is the file, but for local display we use the string
        file: this.selectedFile,
        caption: this.postForm.value.caption,
        location: this.postForm.value.location,
        tags: this.postForm.value.tags ? this.postForm.value.tags.split(',').map((t: string) => t.trim()) : [],
        filters: this.filterString(),
        timestamp: new Date()
      };
      this.postCreated.emit(post);
      this.close();
    }
  }
}
