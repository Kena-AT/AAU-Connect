import { Injectable, inject, signal, computed } from '@angular/core';
import { Group, GroupType, CreateGroupDto } from '../models/group.model';
import { GroupApiService } from '../api/group-api.service';

@Injectable({
  providedIn: 'root'
})
export class GroupStore {
  private api = inject(GroupApiService);

  // State
  private _myGroups = signal<Group[]>([]);
  private _selectedGroup = signal<Group | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public readonly signals
  readonly myGroups = this._myGroups.asReadonly();
  readonly selectedGroup = this._selectedGroup.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals for filtered groups
  readonly courseGroups = computed(() =>
    this._myGroups().filter(g => g.type === 'course')
  );

  readonly departmentGroups = computed(() =>
    this._myGroups().filter(g => g.type === 'department')
  );

  readonly clubGroups = computed(() =>
    this._myGroups().filter(g => g.type === 'club')
  );

  readonly studyGroups = computed(() =>
    this._myGroups().filter(g => g.type === 'study')
  );

  readonly groupCount = computed(() => this._myGroups().length);

  // Actions
  loadMyGroups() {
    this._loading.set(true);
    this._error.set(null);

    this.api.getMyGroups().subscribe({
      next: (groups) => {
        this._myGroups.set(groups);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load groups');
        this._loading.set(false);
        console.error('Error loading groups:', err);
      }
    });
  }

  loadGroupDetails(groupId: string) {
    this._loading.set(true);
    this._error.set(null);

    this.api.getGroupDetails(groupId).subscribe({
      next: (group) => {
        this._selectedGroup.set(group);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to load group details');
        this._loading.set(false);
        console.error('Error loading group details:', err);
      }
    });
  }

  createGroup(data: CreateGroupDto) {
    this._loading.set(true);
    this._error.set(null);

    this.api.createGroup(data).subscribe({
      next: (group) => {
        this._myGroups.update(groups => [...groups, group]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to create group');
        this._loading.set(false);
        console.error('Error creating group:', err);
      }
    });
  }

  deleteGroup(groupId: string) {
    this._loading.set(true);
    this._error.set(null);

    this.api.deleteGroup(groupId).subscribe({
      next: () => {
        this._myGroups.update(groups => groups.filter(g => g.id !== groupId));
        if (this._selectedGroup()?.id === groupId) {
          this._selectedGroup.set(null);
        }
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to delete group');
        this._loading.set(false);
        console.error('Error deleting group:', err);
      }
    });
  }

  joinGroup(groupId: string) {
    this._loading.set(true);
    this._error.set(null);

    this.api.joinGroup(groupId).subscribe({
      next: () => {
        // Reload groups to get updated membership
        this.loadMyGroups();
      },
      error: (err) => {
        this._error.set('Failed to join group');
        this._loading.set(false);
        console.error('Error joining group:', err);
      }
    });
  }

  leaveGroup(groupId: string) {
    this._loading.set(true);
    this._error.set(null);

    this.api.leaveGroup(groupId).subscribe({
      next: () => {
        this._myGroups.update(groups => groups.filter(g => g.id !== groupId));
        if (this._selectedGroup()?.id === groupId) {
          this._selectedGroup.set(null);
        }
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Failed to leave group');
        this._loading.set(false);
        console.error('Error leaving group:', err);
      }
    });
  }

  clearError() {
    this._error.set(null);
  }

  clearSelectedGroup() {
    this._selectedGroup.set(null);
  }
}
