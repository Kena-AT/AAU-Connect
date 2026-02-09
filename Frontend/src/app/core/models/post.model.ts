export interface PostComment {
  // Updated for AAU Connect UI Refinement
  _id: string;
  author: {
    firstName: string;
    lastName: string;
    initials: string;
    avatarUrl?: string;
  };
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string; // From MongoDB
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    initials: string;
    gradient: string;
    avatarUrl?: string;
  };
  course: string;
  createdAt: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  likes: string[]; // IDs of users who liked
  isSaved: string[]; // IDs of users who saved
  location?: string | null;
  filters?: string | null;
  
  // Frontend helpers
  showComments?: boolean;
  commentsList?: PostComment[];
}

export interface Story {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    initials: string;
    gradient: string;
  };
  content: string;
  createdAt: string;
}
