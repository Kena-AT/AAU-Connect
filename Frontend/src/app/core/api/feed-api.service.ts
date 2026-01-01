import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Move to models/feed.model.ts
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  type: 'academic' | 'social' | 'event';
  likesCount: number;
  commentsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedApiService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/feed';

  getFeed(page: number = 1, limit: number = 20): Observable<Post[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<Post[]>(this.API_URL, { params });
  }

  createPost(content: string, type: string): Observable<Post> {
    return this.http.post<Post>(this.API_URL, { content, type });
  }

  likePost(postId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${postId}/like`, {});
  }
}
