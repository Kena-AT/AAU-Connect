import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Move to models/course.model.ts
export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  department: string;
  instructorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseApiService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/courses';

  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/enrolled`);
  }

  getCourseDetails(courseId: string): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/${courseId}`);
  }

  getCourseResources(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/${courseId}/resources`);
  }
}
