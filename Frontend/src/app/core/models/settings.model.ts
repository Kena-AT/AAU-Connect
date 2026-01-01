export interface UserSettings {
  account: AccountSettings;
  privacy: PrivacySettings;
  notifications: NotificationPreferences;
  security: SecuritySettings;
}

export interface AccountSettings {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  year: number;
  studentId: string;
  profilePicture?: string;
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'students-only' | 'private';
  showCourseInfo: boolean;
  showGroupMemberships: boolean;
  showEmail: boolean;
}

export interface NotificationPreferences {
  posts: NotificationChannel;
  messages: NotificationChannel;
  events: NotificationChannel;
  deadlines: NotificationChannel;
  groupInvites: NotificationChannel;
}

export interface NotificationChannel {
  enabled: boolean;
  push: boolean;
  email: boolean;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  lastPasswordChange?: Date;
  activeSessions: ActiveSession[];
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateAccountDto {
  firstName?: string;
  lastName?: string;
  department?: string;
  year?: number;
  bio?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}
