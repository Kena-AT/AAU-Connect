import { Component, ViewChild, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Heart, MessageCircle, Bookmark, Share2, MoreVertical, Plus, Edit, Image, Send } from 'lucide-angular';
import { CreateStoryModalComponent } from '../../../shared/components/create-story-modal/create-story-modal.component';
import { CreatePostModalComponent } from '../../../shared/components/create-post-modal/create-post-modal.component';
import { User } from '../../../core/models/user.model';

import { Post, PostComment, Story } from '../../../core/models/post.model';
import { FeedApiService } from '../../../core/api/feed-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { UiStore } from '../../../core/state/ui.store';
import { effect } from '@angular/core';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CreateStoryModalComponent, CreatePostModalComponent],
  template: `
    <div class="feed-container">
      <!-- Stories Bar -->
      <div class="stories-bar glass-card">
        <div class="stories-scroll">
          <!-- Current User Story / Add Story -->
          <div class="story-item user-story-wrapper" (click)="onUserStoryClick()">
            <div class="story-ring" [class.active]="userHasStory()">
              <div class="story-avatar user-avatar-main">
                @if (userHasStory()) {
                  <span class="initials">{{ auth.currentUser()?.initials }}</span>
                } @else {
                  <lucide-icon [img]="PlusIcon" class="plus-icon-small"></lucide-icon>
                }
              </div>
            </div>
            <span class="story-label">{{ userHasStory() ? 'Your Story' : 'Add Story' }}</span>
          </div>

          @for (story of stories; track story._id) {
            @if (story.author._id !== auth.currentUser()?._id) {
              <div class="story-item" (click)="viewStory(story)">
                <div class="story-ring active">
                  <div class="story-avatar gradient-text" [style.background]="story.author.gradient">
                    {{ story.author.initials }}
                  </div>
                </div>
                <span class="story-label">{{ story.author.firstName }}</span>
              </div>
            }
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

      <!-- Story Viewer Modal -->
      @if (currentStoryView()) {
        <div class="story-viewer-overlay" (click)="closeStoryViewer()">
          <div class="story-viewer-container" (click)="$event.stopPropagation()">
            <button class="story-close-btn" (click)="closeStoryViewer()">&times;</button>
            <div class="story-viewer-header">
              <div class="story-author-info">
                <div class="story-author-avatar gradient-text" [style.background]="currentStoryView()!.author.gradient">
                  {{ currentStoryView()!.author.initials }}
                </div>
                <span class="story-author-name">{{ currentStoryView()!.author.firstName }} {{ currentStoryView()!.author.lastName }}</span>
              </div>
            </div>
            <div class="story-viewer-content">
              <img [src]="currentStoryView()!.content" alt="Story" />
            </div>
          </div>
        </div>
      }

      <!-- Academic Posts -->
      <div class="posts-feed">
        @for (post of posts; track post._id) {
          <article class="post-card glass-card card-3d">
            <!-- Post Header -->
            <div class="post-header">
              <div class="post-author">
                <div class="author-avatar gradient-text" [style.background]="post.author.gradient">
                  {{ post.author.initials }}
                </div>
                <div class="author-info">
                  <p class="author-name">{{ post.author.firstName }} {{ post.author.lastName }}</p>
                  <span class="post-meta">
                    {{ post.course }} • {{ post.createdAt | date:'shortTime' }}
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
                <div class="post-image-container" [style.filter]="post.filters || 'none'">
                  <img [src]="post.image" class="post-image" alt="Post content" />
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
                [class.liked]="isLiked(post)" 
                (click)="toggleLike(post)">
                <lucide-icon [img]="HeartIcon" class="icon"></lucide-icon>
                <span>{{ post.likes.length }}</span>
              </button>
              <button class="action-btn btn-interactive" (click)="toggleComments(post)">
                <lucide-icon [img]="CommentIcon" class="icon"></lucide-icon>
                <span>{{ post.commentsList?.length || 0 }}</span>
              </button>
              <button class="action-btn btn-interactive" 
                [class.saved]="isSaved(post)" 
                (click)="toggleSave(post)">
                <lucide-icon [img]="BookmarkIcon" class="icon"></lucide-icon>
                <span>{{ isSaved(post) ? 'Saved' : 'Save' }}</span>
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
                    <span>{{ auth.currentUser()?.initials || 'YO' }}</span>
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
                  @for (comment of post.commentsList; track comment._id) {
                    <div class="comment-item">
                      <div class="comment-avatar">
                        {{ comment.author.initials }}
                      </div>
                      <div class="comment-content">
                        <span class="comment-author">{{ comment.author.firstName }} {{ comment.author.lastName }}</span>
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
      padding-top: var(--space-6);
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
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      animation: pulse-ring 2s ease-in-out infinite;
      box-shadow: 0 0 15px rgba(220, 39, 67, 0.4);
    }

    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }

    .story-avatar {
      width: 62px;
      height: 62px;
      border-radius: var(--radius-full);
      border: 3px solid var(--bg-app);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: var(--text-lg);
      transition: transform var(--transition-base);
      background: var(--bg-card);
      flex-shrink: 0;
    }

    .user-avatar-main {
      background: var(--bg-glass);
      border-color: var(--bg-app);
      color: var(--text-primary);
      position: relative;
    }

    .plus-icon-small {
      width: 20px;
      height: 20px;
      color: var(--primary-500);
    }

    .user-story-wrapper:hover .story-avatar {
      transform: scale(1.05);
    }

    .story-item:hover .story-avatar {
      transform: scale(1.05);
    }

    .story-label {
      font-size: 11px;
      color: var(--text-secondary);
      max-width: 74px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
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
      height: 450px;
      margin-bottom: var(--space-5);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
    }
    
    .post-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

    /* Post Creation removed to Sidebar */
    /* Toast */

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

    /* Story Viewer Modal */
    .story-viewer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .story-viewer-container {
      position: relative;
      max-width: 500px;
      max-height: 90vh;
      width: 100%;
      background: var(--bg-card);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      animation: scaleIn 0.3s ease;
    }

    .story-close-btn {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: var(--radius-full);
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .story-close-btn:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }

    .story-viewer-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding: var(--space-4);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
      z-index: 5;
    }

    .story-author-info {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .story-author-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: var(--text-sm);
      border: 2px solid white;
    }

    .story-author-name {
      color: white;
      font-weight: 600;
      font-size: var(--text-sm);
    }

    .story-viewer-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: black;
    }

    .story-viewer-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class FeedComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private api = inject(FeedApiService);
  public auth = inject(AuthService);
  public ui = inject(UiStore);

  @ViewChild('storyModal') storyModal!: CreateStoryModalComponent;
  @ViewChild('postModal') postModal!: CreatePostModalComponent;

  toastMessage: string | null = null;
  userHasStory = signal(false);

  constructor() {
    effect(() => {
      if (this.ui.showCreatePostModal()) {
        this.postModal.open();
        this.ui.closeCreatePostModal(); // Toggle back immediately after opening
      }
    });
  }

  readonly HeartIcon = Heart;
  readonly CommentIcon = MessageCircle;
  readonly BookmarkIcon = Bookmark;
  readonly ShareIcon = Share2;
  readonly MoreIcon = MoreVertical;
  readonly PlusIcon = Plus;
  readonly EditIcon = Edit;
  readonly ImageIcon = Image;
  readonly SendIcon = Send;

  stories: Story[] = [];
  posts: Post[] = [];

  ngOnInit() {
    this.loadPosts();
    this.loadStories();
  }

  loadPosts() {
    this.api.getFeed().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.showToast('Failed to load feed');
      }
    });
  }

  loadStories() {
    this.api.getStories().subscribe({
      next: (stories) => {
        this.stories = stories;
        // Check if current user has an active story
        const currentUser = this.auth.currentUser();
        if (currentUser) {
          const hasStory = stories.some(s => s.author._id === currentUser._id);
          this.userHasStory.set(hasStory);
        }
      },
      error: (err) => console.error('Error loading stories:', err)
    });
  }

  onUserStoryClick() {
    if (this.userHasStory()) {
      const myStory = this.stories.find(s => s.author._id === this.auth.currentUser()?._id);
      if (myStory) this.viewStory(myStory);
    } else {
      this.storyModal.open();
    }
  }

  currentStoryView = signal<Story | null>(null);

  viewStory(story: Story) {
    this.currentStoryView.set(story);
  }

  closeStoryViewer() {
    this.currentStoryView.set(null);
  }

  savePosts() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aau-connect-posts', JSON.stringify(this.posts));
    }
  }

  onStoryCreated(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      this.api.createStory(content).subscribe({
        next: (newStory) => {
          this.stories.unshift(newStory);
          this.showToast('Story uploaded successfully!');
        },
        error: (err) => {
          console.error('Error creating story:', err);
          this.showToast('Failed to upload story');
        }
      });
    };
    reader.readAsDataURL(file);
  }

  onPostCreated(post: any) {
    const postData = {
      title: post.caption?.substring(0, 50) || 'New Snapshot',
      description: post.caption || '',
      image: post.media || null,
      tags: post.tags || [],
      location: post.location || null,
      filters: post.filters || null,
      course: 'General'
    };

    this.api.createPost(postData).subscribe({
      next: (newPost) => {
        this.showToast('Post shared successfully!');
        // Reload the entire feed to get fresh data from backend
        this.loadPosts();
      },
      error: (err) => {
        console.error('Error creating post:', err);
        this.showToast('Failed to share post');
      }
    });
  }

  toggleLike(post: Post) {
    this.api.toggleLike(post._id).subscribe({
      next: (likes) => {
        post.likes = likes;
      }
    });
  }

  toggleSave(post: Post) {
    this.api.toggleSave(post._id).subscribe({
      next: (saves) => {
        post.isSaved = saves;
        const isCurrentlySaved = saves.includes(this.auth.currentUser()?._id || '');
        this.showToast(isCurrentlySaved ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
      }
    });
  }

  toggleComments(post: Post) {
    post.showComments = !post.showComments;
    if (post.showComments && (!post.commentsList || post.commentsList.length === 0)) {
      this.api.getComments(post._id).subscribe({
        next: (comments) => {
          post.commentsList = comments;
        }
      });
    }
  }

  addComment(post: Post, text: string) {
    if (!text.trim()) return;

    this.api.addComment(post._id, text).subscribe({
      next: (comment) => {
        if (!post.commentsList) post.commentsList = [];
        post.commentsList.push(comment);
        this.showToast('Comment added');
      }
    });
  }

  sharePost(post: Post) {
    navigator.clipboard.writeText(window.location.href);
    this.showToast('Link copied to clipboard!');
  }

  isLiked(post: Post): boolean {
    return post.likes.includes(this.auth.currentUser()?._id || '');
  }

  isSaved(post: Post): boolean {
    return post.isSaved.includes(this.auth.currentUser()?._id || '');
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}
