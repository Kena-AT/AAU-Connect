import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private http = inject(HttpClient);
  private API_URL = '/api/users';

  toggleFollow(userId: string): Observable<{ isFollowing: boolean; followingCount: number }> {
    return this.http.post<{ success: boolean; isFollowing: boolean; followingCount: number }>(
      `${this.API_URL}/${userId}/follow`, 
      {}
    );
  }

  getRecommendedFriends(): Observable<User[]> {
    return this.http.get<{ success: boolean; data: User[] }>(`${this.API_URL}/recommended`).pipe(
      map(res => res.data)
    );
  }
}
