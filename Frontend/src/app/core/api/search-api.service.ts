import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SearchResult {
  id: string;
  type: 'people' | 'groups' | 'posts' | 'events';
  title: string;
  description: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:5000/api/search';

  search(query: string, type: string = 'all'): Observable<SearchResult[]> {
    return this.http.get<{ success: boolean, data: SearchResult[] }>(this.API_URL, {
      params: { q: query, type }
    }).pipe(
      map(res => res.data)
    );
  }
}
