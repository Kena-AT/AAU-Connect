import { Injectable, inject, signal } from '@angular/core';
import { CourseApiService, Course } from '../api/course-api.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseStore {
  private api = inject(CourseApiService);

  // State
  private _courses = signal<Course[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Selectors
  readonly courses = this._courses.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Actions
  loadEnrolledCourses() {
    this._loading.set(true);
    this.api.getEnrolledCourses().subscribe({
      next: (courses) => {
        this._courses.set(courses);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Failed to load courses');
        this._loading.set(false);
      }
    });
  }
}
