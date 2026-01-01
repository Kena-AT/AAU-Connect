export type EventType = 'workshop' | 'seminar' | 'social' | 'academic' | 'other';
export type EventVisibility = 'public' | 'private' | 'invite-only';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  visibility: EventVisibility;
  date: Date;
  location: string;
  organizerId: string;
  organizerName: string;
  coverImage?: string;
  attendeeCount: number;
  isAttending?: boolean;
  isOwner?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDto {
  title: string;
  description: string;
  type: EventType;
  visibility: EventVisibility;
  date: string; // ISO string
  location: string;
  coverImage?: string;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  type?: EventType;
  visibility?: EventVisibility;
  date?: string;
  location?: string;
  coverImage?: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  workshop: 'Workshop',
  seminar: 'Seminar',
  social: 'Social Event',
  academic: 'Academic Talk',
  other: 'Other'
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  workshop: 'var(--gradient-primary)',
  seminar: 'var(--gradient-secondary)',
  social: 'var(--gradient-sunset)',
  academic: 'var(--gradient-ocean)',
  other: 'var(--gradient-fire)'
};
