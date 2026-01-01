import { Component, ViewChild, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Heart, MessageCircle, Bookmark, Share2, MoreVertical, Plus, Edit, Image, Send } from 'lucide-angular';
import { CreateStoryModalComponent } from '../../../shared/components/create-story-modal/create-story-modal.component';
import { CreatePostModalComponent } from '../../../shared/components/create-post-modal/create-post-modal.component';

interface PostComment {
  id: number;
  author: string;
  initials: string;
  text: string;
  timestamp: Date;
}

interface Post {
  id: number;
  author: {
    name: string;
    initials: string;
    gradient: string;
  };
  course: string;
  timeAgo: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;

  // Optional/New properties
  location?: string | null;
  filters?: string | null;
  showComments?: boolean;
  commentsList?: PostComment[];
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateStoryModalComponent, CreatePostModalComponent],
  template: `
    <div class="feed-container">
      <!-- Stories Bar -->
      <div class="stories-bar glass-card">
        <div class="stories-scroll">
          <!-- Add Story Button -->
          <div class="story-item add-story" (click)="storyModal.open()">
            <div class="story-ring add-ring">
              <div class="story-avatar add-avatar">
                <lucide-icon [img]="PlusIcon" class="plus-icon"></lucide-icon>
              </div>
            </div>
            <span class="story-label">Add Story</span>
          </div>

          @for (story of stories; track story.id) {
            <div class="story-item">
              <div class="story-ring" [class.active]="story.hasNew">
                <div class="story-avatar gradient-text" [style.background]="story.gradient">
                  {{ story.initials }}
                </div>
              </div>
              <span class="story-label">{{ story.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Story Creation Modal -->
      <app-create-story-modal #storyModal (storyCreated)="onStoryCreated($event)"></app-create-story-modal>

      <!-- Post Creation Modal -->
      <app-create-post-modal #postModal (postCreated)="onPostCreated($event)"></app-create-post-modal>

      <!-- Toast Notification -->
      @if (toastMessage) {
        <div class="toast-notification glass-card">
          {{ toastMessage }}
        </div>
      }

      <!-- Floating Action Button -->
      <button class="fab" (click)="postModal.open()" title="Create Post">
        <lucide-icon [img]="EditIcon" class="fab-icon"></lucide-icon>
      </button>

      <!-- Inline Create Post Card -->
      <div class="create-post-card glass-card" (click)="postModal.open()">
        <div class="current-user-avatar">
          <span>YO</span>
        </div>
        <div class="fake-input">
          Share a photo or video...
        </div>
        <button class="btn-icon">
          <lucide-icon [img]="ImageIcon" class="icon"></lucide-icon>
        </button>
      </div>

      <!-- Academic Posts -->
      <div class="posts-feed">
        @for (post of posts; track post.id) {
          <article class="post-card glass-card card-3d">
            <!-- Post Header -->
            <div class="post-header">
              <div class="post-author">
                <div class="author-avatar gradient-text" [style.background]="post.author.gradient">
                  {{ post.author.initials }}
                </div>
                <div class="author-info">
                  <p class="author-name">{{ post.author.name }}</p>
                  <span class="post-meta">
                    {{ post.course }} • {{ post.timeAgo }}
                    @if (post.location) { • {{ post.location }} }
                  </span>
                </div>
              </div>
              <button class="btn-more btn-interactive">
                <lucide-icon [img]="MoreIcon" class="icon"></lucide-icon>
              </button>
            </div>

            <!-- Post Content -->
            <div class="post-content">
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-description">{{ post.description }}</p>
              @if (post.image) {
                <div class="post-image-container blob" [style.filter]="post.filters || 'none'">
                   <div class="post-image" [style.background]="post.image"></div>
                </div>
              }
              @if (post.tags && post.tags.length > 0) {
                <div class="post-tags">
                  @for (tag of post.tags; track tag) {
                    <span class="tag neumorphic-inset">{{ tag }}</span>
                  }
                </div>
              }
            </div>

            <!-- Post Actions -->
            <div class="post-actions">
              <button class="action-btn btn-interactive" 
                [class.liked]="post.isLiked" 
                (click)="toggleLike(post)">
                <lucide-icon [img]="HeartIcon" class="icon"></lucide-icon>
                <span>{{ post.likes }}</span>
              </button>
              <button class="action-btn btn-interactive" (click)="toggleComments(post)">
                <lucide-icon [img]="CommentIcon" class="icon"></lucide-icon>
                <span>{{ post.comments }}</span>
              </button>
              <button class="action-btn btn-interactive" 
                [class.saved]="post.isSaved" 
                (click)="toggleSave(post)">
                <lucide-icon [img]="BookmarkIcon" class="icon"></lucide-icon>
                <span>{{ post.isSaved ? 'Saved' : 'Save' }}</span>
              </button>
              <button class="action-btn btn-interactive" (click)="sharePost(post)">
                <lucide-icon [img]="ShareIcon" class="icon"></lucide-icon>
                <span>Share</span>
              </button>
            </div>

            <!-- Comments Section -->
            @if (post.showComments) {
              <div class="comments-section">
                <div class="add-comment">
                  <div class="user-avatar-small">
                    <span>YO</span>
                  </div>
                  <input 
                    #commentInput
                    type="text" 
                    placeholder="Write a comment..." 
                    class="comment-input"
                    (keyup.enter)="addComment(post, commentInput.value); commentInput.value = ''" />
                  <button class="btn-send" (click)="addComment(post, commentInput.value); commentInput.value = ''">
                    <lucide-icon [img]="SendIcon" class="icon-sm"></lucide-icon>
                  </button>
                </div>

                <div class="comments-list">
                  @for (comment of post.commentsList; track comment.id) {
                    <div class="comment-item">
                      <div class="comment-avatar">
                        {{ comment.initials }}
                      </div>
                      <div class="comment-content">
                        <span class="comment-author">{{ comment.author }}</span>
                        <p class="comment-text">{{ comment.text }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </article>
        }
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* Stories Bar */
    .stories-bar {
      padding: var(--space-5);
      overflow: hidden;
    }

    .stories-scroll {
      display: flex;
      gap: var(--space-4);
      overflow-x: auto;
      padding-bottom: var(--space-2);
      scrollbar-width: none;
    }

    .stories-scroll::-webkit-scrollbar {
      display: none;
    }

    .story-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      flex-shrink: 0;
      transition: transform var(--transition-base);
    }

    .story-item:hover {
      transform: scale(1.05);
    }

    .story-ring {
      padding: 3px;
      border-radius: var(--radius-full);
      background: var(--border-color);
      transition: all var(--transition-base);
    }

    .story-ring.active {
      background: var(--gradient-neon);
      animation: pulse-ring 2s ease-in-out infinite;
      box-shadow: var(--shadow-neon);
    }

    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .story-avatar {
      width: 68px;
      height: 68px;
      border-radius: var(--radius-full);
      border: 4px solid var(--bg-card);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-xl);
      transition: transform var(--transition-base);
      box-shadow: var(--shadow-lg);
    }

    .story-item:hover .story-avatar {
      transform: scale(1.1) rotate(5deg);
    }

    .story-label {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      max-width: 74px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 600;
    }

    /* Add Story Button */
    .add-story {
      opacity: 0.9;
    }

    .add-ring {
      background: var(--bg-glass);
      border: 2px dashed var(--border-glass);
    }

    .add-avatar {
      background: var(--gradient-primary) !important;
      cursor: pointer;
    }

    .plus-icon {
      width: 32px;
      height: 32px;
      color: white;
    }

    .add-story:hover .add-ring {
      border-color: var(--primary-500);
      background: var(--bg-card);
    }

    .add-story:hover .add-avatar {
      transform: scale(1.1) rotate(90deg);
    }

    /* Posts Feed */
    .posts-feed {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .post-card {
      padding: 0;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .post-card:hover {
      transform: translateY(-6px) scale(1.01);
      box-shadow: var(--shadow-2xl);
    }

    /* Post Header */
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-5);
    }

    .post-author {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-base);
      flex-shrink: 0;
      box-shadow: var(--shadow-lg);
      position: relative;
    }

    .author-avatar::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: var(--radius-full);
      background: inherit;
      z-index: -1;
      opacity: 0.4;
      filter: blur(10px);
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .post-meta {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      font-weight: 600;
    }

    .btn-more {
      width: 36px;
      height: 36px;
      background: var(--bg-glass);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .btn-more .icon {
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .btn-more:hover {
      background: var(--bg-card);
      transform: rotate(90deg);
    }

    .btn-more:hover .icon {
      color: var(--text-primary);
    }

    /* Post Content */
    .post-content {
      padding: 0 var(--space-5) var(--space-5);
    }

    .post-title {
      font-size: var(--text-xl);
      font-weight: 800;
      font-family: var(--font-display);
      color: var(--text-primary);
      margin: 0 0 var(--space-3) 0;
      line-height: 1.3;
    }

    .post-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--space-5) 0;
    }

    .post-image-container {
      width: 100%;
      height: 320px;
      margin-bottom: var(--space-5);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
    }
    
    .post-image {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }

    .post-card:hover .post-image-container {
      transform: scale(1.02);
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .tag {
      padding: var(--space-2) var(--space-4);
      background: var(--bg-glass);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--primary-600);
      border: 1px solid var(--border-glass);
      transition: all var(--transition-base);
    }

    .tag:hover {
      background: var(--primary-100);
      transform: scale(1.05);
    }

    /* Post Actions */
    .post-actions {
      display: flex;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-5);
      border-top: 1px solid var(--border-glass);
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background: var(--bg-glass);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--text-sm);
      font-weight: 700;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .action-btn .icon {
      width: 18px;
      height: 18px;
      transition: all var(--transition-bounce);
    }

    .action-btn:hover {
      background: var(--bg-card);
      color: var(--primary-600);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .action-btn:hover .icon {
      transform: scale(1.2) rotate(-5deg);
    }

    .action-btn:nth-child(1):hover {
      color: var(--danger-500);
    }

    .action-btn:nth-child(1):hover .icon {
      fill: var(--danger-500);
    }

    .action-btn.liked {
      color: var(--danger-500);
    }

    .action-btn.liked .icon {
      fill: var(--danger-500);
    }

    .action-btn.saved {
      color: var(--primary-600);
    }

    .action-btn.saved .icon {
      fill: var(--primary-600);
    }

    /* Floating Action Button */
    .fab {
      position: fixed;
      bottom: var(--space-8);
      right: var(--space-8);
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border: none;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-2xl);
      transition: all var(--transition-base);
      z-index: 100;
    }

    .fab-icon {
      width: 28px;
      height: 28px;
      color: white;
    }

    .fab:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
    }

    /* Create Post Card */
    .create-post-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      margin-bottom: var(--space-6);
      cursor: text;
      transition: all var(--transition-base);
    }

    .create-post-card:hover {
      background: var(--bg-card);
      transform: translateY(-2px);
    }

    .current-user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--text-sm);
      flex-shrink: 0;
    }

    .fake-input {
      flex: 1;
      padding: var(--space-3);
      background: var(--bg-glass);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: var(--text-sm);
      border: 1px solid transparent;
      transition: all var(--transition-base);
    }

    .create-post-card:hover .fake-input {
      background: var(--bg-app);
      border-color: var(--border-color);
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--bg-glass);
      color: var(--primary-600);
    }

    @media (max-width: 768px) {
      .fab {
        bottom: var(--space-6);
        right: var(--space-6);
        width: 56px;
        height: 56px;
      }
    }

    /* Comments Section */
    .comments-section {
      padding: var(--space-4) var(--space-5);
      background: var(--bg-glass);
      border-top: 1px solid var(--border-glass);
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .add-comment {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-4);
    }

    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--primary-600);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--text-xs);
      flex-shrink: 0;
    }

    .comment-input {
      flex: 1;
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-full);
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-sm);
      color: var(--text-primary);
    }

    .comment-input:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .btn-send {
      background: none;
      border: none;
      color: var(--primary-600);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .comment-item {
      display: flex;
      gap: var(--space-3);
    }

    .comment-avatar {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: var(--neutral-300);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 10px;
      flex-shrink: 0;
    }

    .comment-content {
      background: var(--bg-card);
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-lg);
      border-top-left-radius: 0;
    }

    .comment-author {
      font-size: var(--text-xs);
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }

    .comment-text {
      font-size: var(--text-sm);
      margin: 0;
      color: var(--text-secondary);
    }

    /* Toast */
    .toast-notification {
      position: fixed;
      bottom: var(--space-8);
      left: 50%;
      transform: translateX(-50%);
      background: var(--primary-600);
      color: white;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xl);
      z-index: 1000;
      font-weight: 600;
      animation: fadeInOut 3s ease forwards;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, 20px); }
      10% { opacity: 1; transform: translate(-50%, 0); }
      90% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }
  `]
})
export class FeedComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChild('storyModal') storyModal!: CreateStoryModalComponent;
  @ViewChild('postModal') postModal!: CreatePostModalComponent;

  toastMessage: string | null = null;

  readonly HeartIcon = Heart;
  readonly CommentIcon = MessageCircle;
  readonly BookmarkIcon = Bookmark;
  readonly ShareIcon = Share2;
  readonly MoreIcon = MoreVertical;
  readonly PlusIcon = Plus;
  readonly EditIcon = Edit;
  readonly ImageIcon = Image;
  readonly SendIcon = Send;

  stories = [
    { id: 1, label: 'Study Group', initials: 'SG', gradient: 'var(--gradient-primary)', hasNew: true },
    { id: 2, label: 'CS Lecture', initials: 'CS', gradient: 'var(--gradient-secondary)', hasNew: true },
    { id: 3, label: 'Lab Session', initials: 'LS', gradient: 'var(--gradient-success)', hasNew: false },
    { id: 4, label: 'Research', initials: 'R', gradient: 'var(--gradient-sunset)', hasNew: false }
  ];

  posts: Post[] = [
    {
      id: 1,
      author: { name: 'Dr. Sarah Johnson', initials: 'SJ', gradient: 'var(--gradient-primary)' },
      course: 'CS 301',
      timeAgo: '2h ago',
      title: 'New Research Paper on Quantum Computing',
      description: 'Excited to share our latest findings on quantum entanglement and its applications in cryptography. This could revolutionize how we think about secure communications.',
      image: 'var(--gradient-ocean)',
      tags: ['Quantum', 'Research', 'Cryptography'],
      likes: 234,
      comments: 45,
      isLiked: false,
      isSaved: false,
      location: 'Science Building',
      commentsList: []
    },
    {
      id: 2,
      author: { name: 'Marcus Chen', initials: 'MC', gradient: 'var(--gradient-secondary)' },
      course: 'MATH 205',
      timeAgo: '5h ago',
      title: 'Study Group for Final Exam',
      description: '',
      image: null,
      tags: ['Study Group', 'Linear Algebra'],
      likes: 89,
      comments: 23,
      isLiked: false,
      isSaved: false,
      commentsList: []
    },
    {
      id: 3,
      author: { name: 'Prof. Anderson', initials: 'PA', gradient: 'var(--gradient-success)' },
      course: 'PHYS 201',
      timeAgo: '1d ago',
      title: 'Lab Report Guidelines Updated',
      description: 'Please review the updated guidelines for lab reports. Pay special attention to the new formatting requirements and citation style.',
      image: 'var(--gradient-sunset)',
      tags: ['Lab', 'Guidelines'],
      likes: 156,
      comments: 12,
      isLiked: false,
      isSaved: true,
      commentsList: []
    }
  ];

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    if (isPlatformBrowser(this.platformId)) {
      const savedPosts = localStorage.getItem('aau-connect-posts');
      if (savedPosts) {
        try {
          const parsed = JSON.parse(savedPosts);
          if (Array.isArray(parsed)) {
            this.posts = parsed;
          }
        } catch (e) {
          console.error('Failed to load posts', e);
        }
      }
    }
  }

  savePosts() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aau-connect-posts', JSON.stringify(this.posts));
    }
  }

  onStoryCreated(file: File) {
    console.log('Story created:', file);
    // Here you would upload the story to the server
    // For now, just log it
    this.showToast('Story uploaded successfully!');
  }

  onPostCreated(post: any) {
    console.log('Post created:', post);
    // Add new post to the beginning of the feed
    const newPost: Post = {
      id: Date.now(),
      author: { name: 'You', initials: 'YO', gradient: 'var(--primary-600)' },
      course: 'General',
      timeAgo: 'Just now',
      title: 'New Snapshot',
      description: post.caption || '',
      image: post.media ? (post.media.startsWith('data:') ? 'url(' + post.media + ')' : post.media) : null,
      tags: post.tags || [],
      location: post.location || null,
      filters: post.filters || null,
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
      showComments: false,
      commentsList: []
    };
    this.posts.unshift(newPost);
    this.savePosts();
  }

  toggleLike(post: Post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    this.savePosts();
  }

  toggleSave(post: Post) {
    post.isSaved = !post.isSaved;
    this.savePosts();
    this.showToast(post.isSaved ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
    if (!post.commentsList) {
      post.commentsList = [];
    }
  }

  addComment(post: Post, text: string) {
    if (!text.trim()) return;

    if (!post.commentsList) post.commentsList = [];

    post.commentsList.push({
      id: Date.now(),
      author: 'You',
      initials: 'YO',
      text: text,
      timestamp: new Date()
    });

    post.comments++;
    this.savePosts();
  }

  sharePost(post: Post) {
    navigator.clipboard.writeText(window.location.href);
    this.showToast('Link copied to clipboard!');
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
