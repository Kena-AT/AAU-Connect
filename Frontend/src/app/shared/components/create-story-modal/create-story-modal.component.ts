import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Upload } from 'lucide-angular';

@Component({
  selector: 'app-create-story-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="close()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create Story</h2>
            <button class="btn-close" (click)="close()">
              <lucide-icon [img]="CloseIcon"></lucide-icon>
            </button>
          </div>

          <div class="story-upload">
            @if (previewUrl()) {
              <div class="preview-container">
                <img [src]="previewUrl()" alt="Story preview" class="story-preview" />
                <button class="btn-remove" (click)="removeImage()">
                  <lucide-icon [img]="CloseIcon"></lucide-icon>
                </button>
              </div>
            } @else {
              <div class="upload-area" (click)="fileInput.click()">
                <lucide-icon [img]="UploadIcon" class="upload-icon"></lucide-icon>
                <h3>Upload Story</h3>
                <p>Click to select an image or video</p>
                <span class="file-info">Max 10MB • JPG, PNG, MP4</span>
              </div>
            }

            <input 
              #fileInput 
              type="file" 
              accept="image/*,video/*" 
              (change)="onFileSelected($event)"
              style="display: none" />
          </div>

          @if (previewUrl()) {
            <div class="story-actions">
              <button class="btn-cancel" (click)="close()">Cancel</button>
              <button class="btn-post" (click)="onPost()">Post Story</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      width: 90%;
      max-width: 500px;
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
      font-weight: 800;
      margin: 0;
    }

    .btn-close {
      width: 36px;
      height: 36px;
      background: var(--bg-glass);
      border: none;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--danger-500);
      color: white;
      transform: rotate(90deg);
    }

    .story-upload {
      padding: var(--space-6);
    }

    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-16);
      border: 2px dashed var(--border-glass);
      border-radius: var(--radius-2xl);
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: center;
    }

    .upload-area:hover {
      border-color: var(--primary-500);
      background: var(--bg-glass);
      transform: scale(1.02);
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      color: var(--primary-500);
      margin-bottom: var(--space-4);
    }

    .upload-area h3 {
      font-size: var(--text-lg);
      font-weight: 700;
      margin: 0 0 var(--space-2) 0;
    }

    .upload-area p {
      color: var(--text-secondary);
      margin: 0 0 var(--space-3) 0;
    }

    .file-info {
      font-size: var(--text-xs);
      color: var(--text-secondary);
    }

    .preview-container {
      position: relative;
      border-radius: var(--radius-2xl);
      overflow: hidden;
    }

    .story-preview {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      border-radius: var(--radius-2xl);
    }

    .btn-remove {
      position: absolute;
      top: var(--space-3);
      right: var(--space-3);
      width: 36px;
      height: 36px;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      border-radius: var(--radius-full);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-remove:hover {
      background: var(--danger-500);
      transform: scale(1.1);
    }

    .story-actions {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-6);
      border-top: 1px solid var(--border-glass);
    }

    .btn-cancel, .btn-post {
      flex: 1;
      padding: var(--space-3);
      border: none;
      border-radius: var(--radius-xl);
      font-weight: 700;
      font-size: var(--text-base);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-cancel {
      background: var(--bg-glass);
      color: var(--text-primary);
      border: 2px solid var(--border-glass);
    }

    .btn-cancel:hover {
      background: var(--bg-card);
    }

    .btn-post {
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .btn-post:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-xl);
    }
  `]
})
export class CreateStoryModalComponent {
  readonly CloseIcon = X;
  readonly UploadIcon = Upload;

  isOpen = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  @Output() storyCreated = new EventEmitter<File>();

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File must be less than 10MB');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  onPost() {
    if (this.selectedFile) {
      this.storyCreated.emit(this.selectedFile);
      this.close();
    }
  }
}
