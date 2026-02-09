import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Post, PostComment, Story } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class FeedApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api';

  // --- Posts ---
  getFeed(): Observable<Post[]> {
    return this.http.get<{ success: boolean, data: Post[] }>(`${this.API_URL}/posts`).pipe(
      map(res => res.data)
    );
  }

  createPost(postData: any): Observable<Post> {
    return this.http.post<{ success: boolean, data: Post }>(`${this.API_URL}/posts`, postData).pipe(
      map(res => res.data)
    );
  }

  toggleLike(postId: string): Observable<string[]> {
    return this.http.post<{ success: boolean, data: string[] }>(`${this.API_URL}/posts/${postId}/like`, {}).pipe(
      map(res => res.data)
    );
  }

  toggleSave(postId: string): Observable<string[]> {
    return this.http.post<{ success: boolean, data: string[] }>(`${this.API_URL}/posts/${postId}/save`, {}).pipe(
      map(res => res.data)
    );
  }

  // --- Comments ---
  getComments(postId: string): Observable<PostComment[]> {
    return this.http.get<{ success: boolean, data: PostComment[] }>(`${this.API_URL}/comments/${postId}`).pipe(
      map(res => res.data)
    );
  }

  addComment(postId: string, text: string): Observable<PostComment> {
    return this.http.post<{ success: boolean, data: PostComment }>(`${this.API_URL}/comments/${postId}`, { text }).pipe(
      map(res => res.data)
    );
  }

  // --- Stories ---
  getStories(): Observable<Story[]> {
    return this.http.get<{ success: boolean, data: Story[] }>(`${this.API_URL}/stories`).pipe(
      map(res => res.data)
    );
  }

  createStory(content: string): Observable<Story> {
    return this.http.post<{ success: boolean, data: Story }>(`${this.API_URL}/stories`, { content }).pipe(
      map(res => res.data)
    );
  }
}
