import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GroupMember, CreateGroupDto, UpdateGroupDto, GroupType } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/groups';

  // Get all groups user is member of
  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/my-groups`);
  }

  // Get groups by type
  getGroupsByType(type: GroupType): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}`, {
      params: { type }
    });
  }

  // Get all available groups (for discovery)
  getAllGroups(filters?: { type?: GroupType; search?: string }): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}`, {
      params: filters as any
    });
  }

  // Get group details
  getGroupDetails(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/${groupId}`);
  }

  // Create new group
  createGroup(data: CreateGroupDto): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}`, data);
  }

  // Update group
  updateGroup(groupId: string, data: UpdateGroupDto): Observable<Group> {
    return this.http.patch<Group>(`${this.baseUrl}/${groupId}`, data);
  }

  // Delete group
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}`);
  }

  // Join group
  joinGroup(groupId: string): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.baseUrl}/${groupId}/join`, {});
  }

  // Leave group
  leaveGroup(groupId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${groupId}/leave`, {});
  }

  // Get group members
  getGroupMembers(groupId: string): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.baseUrl}/${groupId}/members`);
  }

  // Search groups
  searchGroups(query: string, filters?: { type?: GroupType }): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/search`, {
      params: { q: query, ...filters } as any
    });
  }

  // Remove member (admin/owner only)
  removeMember(groupId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}/members/${memberId}`);
  }

  // Update member role (admin/owner only)
  updateMemberRole(groupId: string, memberId: string, role: string): Observable<GroupMember> {
    return this.http.patch<GroupMember>(`${this.baseUrl}/${groupId}/members/${memberId}`, { role });
  }
}
