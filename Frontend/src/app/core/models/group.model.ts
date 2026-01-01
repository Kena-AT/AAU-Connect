export type GroupType = 'course' | 'department' | 'club' | 'study' | 'class';
export type GroupVisibility = 'public' | 'private' | 'invite-only';
export type GroupMemberRole = 'owner' | 'admin' | 'moderator' | 'member';

export interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  visibility: GroupVisibility;
  coverImage?: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Optional fields based on type
  courseId?: string;
  courseName?: string;
  departmentId?: string;
  departmentName?: string;

  // User's relationship to this group
  isMember?: boolean;
  memberRole?: GroupMemberRole;
  isOwner?: boolean;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupMemberRole;
  joinedAt: Date;

  // User info (populated from join)
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
  };
}

export interface CreateGroupDto {
  name: string;
  description: string;
  type: GroupType;
  visibility: GroupVisibility;
  coverImage?: string;
  courseId?: string;
  departmentId?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  visibility?: GroupVisibility;
  coverImage?: string;
}

export const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  course: 'Course Group',
  department: 'Department Group',
  club: 'Club',
  study: 'Study Group',
  class: 'Class'
};

export const GROUP_TYPE_ICONS: Record<GroupType, string> = {
  course: '📚',
  department: '🏛️',
  club: '🎯',
  study: '📖',
  class: '🎓'
};

export const GROUP_TYPE_COLORS: Record<GroupType, string> = {
  course: 'var(--gradient-primary)',
  department: 'var(--gradient-success)',
  club: 'var(--gradient-accent)',
  study: 'var(--gradient-primary)',
  class: 'var(--gradient-neon)'
};
