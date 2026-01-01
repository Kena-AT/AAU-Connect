# AAU Connect - Frontend Features & Capabilities

## 1. Core Architecture
- **Framework**: Angular 18+ (Standalone Components).
- **State Management**: Angular Signals & Local Storage Persistence (MVP).
- **Styling**: SCSS with CSS Variables for theming, Glassmorphism design language.
- **Icons**: Lucide Angular.

## 2. Authentication Module (`/auth`)
- **Login**: Secure login page with branding.
- **Signup**: Registration flow for new students/faculty.

## 3. Dashboard Ecosystem (`/dashboard`)
A unified, responsive workspace featuring a persistent Sidebar and dynamic Main Content area.

### A. Feed & Social Hub (`/dashboard/feed`)
A rich, Instagram-inspired social feed tailored for university life.

- **Visual Stories**:
    - Horizontal scrollable stories bar.
    - Status rings indicating seen/unseen state.
    - Quick "Add Story" entry point.

- **Advanced Post Creation Wizard**:
    - **Step 1: Media Selection**: Drag-and-drop or file system selection.
    - **Step 2: Studio Editor**:
        - Real-time CSS Filter adjustments (Brightness, Contrast, Saturation, Sepia, etc.).
        - Image cropping (visual placeholder).
    - **Step 3: Details**:
        - Rich caption input.
        - Location tagging.
        - Collaborative tagging.

- **Post Feed Cards**:
    - **Header**: User avatar with gradient rings, name, timestamp, and location.
    - **Content**: High-fidelity media rendering with applied CSS filters.
    - **Interactions**:
        - **Like**: Animated heart toggle with counter.
        - **Comment**: Expandable comments section using `PostComment` interface, persisting directly to the post object.
        - **Save (Bookmark)**: Personal bookmarking system with visual feedback and toast notifications.
        - **Share**: One-click clipboard copy of post link with toast confirmation.
    - **Persistence**: All posts and interactions are persisted locally via `localStorage` ('aau-connect-posts').

### B. Groups & Academic Collaboration (`/dashboard/groups`)
A unified space merging social clubs with academic course management.

- **Group Types**:
    - **Clubs**: Social and interest-based groups.
    - **Study Groups**: Peer-led learning circles.
    - **Classes**: Formal academic course sections (replacing the standalone Academic dashboard).

- **Group Discovery**:
    - Filterable grid view (All, My Groups, Classes, active filters).
    - "Create Group" wizard supporting multiple types including 'Class'.

- **Group Detail View (`/dashboard/groups/:id`)**:
    - **Overview**: Group banner, description, and member stats.
    - **Discussions**: Threaded conversations for the group.
    - **Assignments Widget**:
        - Track deadlines and task status (ToDo, In Progress, Done).
        - Exclusive to Class/Study groups (or available to all for generic task management).
    - **Resources Widget**:
        - File sharing and link repository.
        - categorization by type (PDF, Link, Video).

### C. Layout & Navigation
- **Professional Sidebar**:
    - Clean, flat aesthetic replacing neon-heavy gradients for a more polished look.
    - Collapsible motion design.
    - Integrated user profile preview.
- **Glassmorphism UI**:
    - Frosted glass effects on cards, modals, and overlays.
    - consistent `backdrop-filter: blur()` usage.

## 4. UI/UX Refinements
- **Toast Notification System**: Global service for non-intrusive feedback (e.g., "Link copied", "Saved to bookmarks").
- **Theme Engine**:
    - CSS Variable-based Theming.
    - Support for System/Light/Dark modes.
- **Animation System**:
    - Micro-interactions (hover scales, icon rotations).
    - Page transitions.
    - Loading states (skeleton screens & spinners).

## 5. Technical Improvements
- **Type Safety**: strict TypeScript interfaces for `Post`, `Group`, `PostComment`, etc.
- **Mock Data Layer**: robust mock data services simulating backend responses for prototyping.
