export type UserRole = 'student' | 'cr' | 'admin' | 'moderator';
// Updated for AAU Connect UI Refinement

export interface User {
  _id?: string;
  id: string; // Mapping standard
  email: string;
  firstName: string;
  lastName: string;
  initials: string;
  gradient?: string;
  studentId?: string;
  role: UserRole;
  isVerified: boolean;
  department?: string;
  avatarUrl?: string;
  followers?: string[];
  following?: string[];
}
