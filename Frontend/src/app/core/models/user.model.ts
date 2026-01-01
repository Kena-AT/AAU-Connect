export type UserRole = 'student' | 'cr' | 'admin' | 'moderator';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  role: UserRole;
  isVerified: boolean;
  department?: string;
  avatarUrl?: string;
}
