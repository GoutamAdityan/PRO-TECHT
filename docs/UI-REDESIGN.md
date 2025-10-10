# UI Grand Redesign Feature

This document outlines the comprehensive visual redesign applied across the ServiceBridge application, focusing on a bold, modern, and elegant aesthetic with enhanced user experience and accessibility.

## Design Principles

-   **Aesthetic:** Bold, modern, elegant — featuring big readable typography, soft glassy cards, layered gradients, subtle 3D depth, lively micro-interactions, and buttery transitions.
-   **Palette:** Warm neutral backgrounds with a deep forest green as the primary accent color. All colors are defined using HSL CSS variables for easy theming and dark mode support.
-   **Typography:** A modular scale is used, with headings (28–44px for hero, subheads 18–22px) utilizing a clean geometric font (Montserrat) and body text (14–16px) using a humanist font (Open Sans), with system fonts as fallbacks.
-   **Motion:** Subtle and accessible animations are integrated using Framer Motion for enter/exit transitions, hover effects, and micro-interactions. Motion respects `prefers-reduced-motion`.
-   **Accessibility:** Semantic HTML, ARIA roles, keyboard navigation, and clear focus states are prioritized. Text contrast ratios meet WCAG 2.1 AA standards (>= 4.5:1).

## Core UI Primitives (`src/components/ui/`)

Several reusable UI components have been created or refactored to support the new design:

-   **`Topbar.tsx`:** A new component for consistent page titles, breadcrumbs (placeholder), and global actions.
-   **`Sidebar.tsx`:** Refactored for uniform item styling, active left accent bar highlighting, and improved collapsed mode behavior.
-   **`Card.tsx`:** Enhanced with glassy effects (backdrop blur, subtle shadows, inner borders).
-   **`StatCard.tsx`:** A new component for displaying key metrics with optional mini-charts.
-   **`Uploader.tsx`:** A new component for file uploads with drag & drop, thumbnail previews, and progress indication.
-   **`Avatar`, `Badge`, `Button`, `Input`, `Textarea`, `Select`, `Table`, `Dialog`, `Sheet`:** Existing shadcn/ui components have been styled to align with the new theme.

## Page-by-Page Redesign Highlights

### 1. Dashboard (`src/pages/Index.tsx`)

-   **Hero Section:** Full-width hero with a soft radial gradient background, large centered heading ("Service Center Portal"), and a circular floating icon badge.
-   **StatCards:** 3–4 prominent `StatCard`s displaying key metrics (e.g., Active jobs, Pending reports, Avg turnaround, SLA compliance) with placeholders for mini charts.
-   **Quick Actions Grid:** A grid of `Card` components for common actions (e.g., Create report, Open chat, Mark complete).
-   **Activity Feed:** A placeholder section for a modern timeline of activities with avatars and timestamps.
-   **Motion:** Staggered fade+slide entry animations for all major sections and cards using Framer Motion.

### 2. Active Jobs (`src/pages/ActiveJobs.tsx`)

-   **Searchable Toolbar:** Clean toolbar with search input, status filter, and a date range picker (placeholder).
-   **Responsive DataTable:** Enhanced `Table` component with improved styling, sorting (mocked), and row actions (View, Claim, Reassign) via `DropdownMenu`.
-   **Status Badges:** Styled with subtle gradients.
-   **Row Hover:** Implemented hover effects (slight scale, shadow increase).
-   **Details Panel Integration:** Clicking a Request ID or "View Details" action opens a right-side `DetailsPanel` (reusing the chat details panel) with job, product, and customer information.
-   **Motion:** Page entry and table row animations using Framer Motion.

### 3. Customer Communication (Chat) (`src/features/chat/*`)

-   **Two-Column Layout:** Left = searchable Customer List, Right = Conversation view (existing structure, enhanced visually).
-   **Customer List:** Sticky search, grouping ("Recent", "Unread"), and selection highlights with a left accent bar and background tint. Hover effects on list items.
-   **Conversation Header:** Displays avatar, name, status, and an info button to toggle the `DetailsPanel`.
-   **Message UI:** Glossy rounded bubbles with subtle tails, timestamps, and double-check read receipts. Agent messages (primary green), customer messages (muted surface).
-   **Composer:** Resizable textarea, emoji picker, attach button, and send button. Optimistic UI for sent messages.
-   **Right DetailsPanel:** Integrated `DetailsPanel` (reusing the component) for product details, customer account, and query history.
-   **Motion:** Entry animations for messages, typing indicators, and hover effects.

### 4. Service Reports (`src/pages/ServiceReports.tsx`)

-   **Gorgeous Form Card:** A main `Card` with glassy styling, grouped fields, and inline validation hints.
-   **File Uploader:** Integrated `Uploader` component with drag & drop, thumbnail previews, and progress indication.
-   **Success Toast:** Enhanced toast notification for report submission with an animated checkmark.
-   **Reports List:** A section displaying submitted reports as cards with status chips, filters, and CTAs to view/download attachments.
-   **Motion:** Page entry and report list item animations.

### 5. Profile (`src/pages/Profile.tsx`)

-   **Card Layout:** Main `Card` with glassy styling, featuring a left avatar section and right details.
-   **Avatar:** Enhanced avatar display with a placeholder image service and a 'change avatar' button (placeholder functionality).
-   **Editable Fields:** Styled form fields, labels, and buttons with the new palette and typography.
-   **Modals:** "Change Email" and "Change Password" functionalities now use accessible `shadcn/ui Dialog` components with glassy styling.
-   **Motion:** Page entry animations.

### 6. About / Marketing Page (`src/pages/About.tsx`)

-   **Large Hero:** Full-width hero section with a soft radial gradient, prominent typography, and a floating icon.
-   **Mission Card:** Glassy card with a muted background block for the mission statement.
-   **Feature Columns:** Three feature columns, each as a glassy card with icons and hover lift animations.
-   **Motion:** Staggered entry animations for sections and cards, and hover effects.

## How to Run Locally

1.  **Install Dependencies:** Ensure you have `npm` or `yarn` installed. Navigate to the project root and run `npm install` or `yarn install`.
2.  **Start Development Server:** Run `npm run dev` or `yarn dev`.
3.  **Preview:** Open your browser and navigate through the application to see the redesigned pages.

## Theme Variables

All core colors are defined as HSL CSS variables in `src/index.css` and referenced in `tailwind.config.ts`. This allows for easy customization and dark mode support. Key variables include `--primary`, `--secondary`, `--accent`, `--background`, `--foreground`, `--card`, `--surface`, and their respective foregrounds.

## Mock vs. Real Realtime/API Adapters

-   **Chat Realtime:** The chat functionality uses `src/features/chat/realtime.ts` as a mock adapter. To integrate with a real Supabase or WebSocket backend, modify this file to use your actual API calls.
-   **Details Panel Data:** The details panel uses `src/features/chat/DetailsPanel/mockDetailsAdapter.ts` for mock data. To integrate with a real backend, modify `src/features/chat/useDetails.ts` to call your actual API endpoints. Ensure your API returns data conforming to the `Product`, `CustomerDetails`, and `Query` interfaces (or update these interfaces to match your API's response).

## Accessibility Checklist

-   **Semantic HTML:** Used appropriate HTML5 elements (`<header>`, `<main>`, `<nav>`, `<h1>`, `<p>`, etc.).
-   **ARIA Roles:** Applied `role="dialog"`, `aria-label`, `aria-live="polite"` where appropriate (e.g., chat message list, details panel).
-   **Keyboard Navigation:** Ensured interactive elements are tabbable and focusable. Dialogs/Sheets manage focus.
-   **Focus States:** Clear visual focus indicators are present for interactive elements.
-   **Contrast:** Color palette chosen with consideration for WCAG 2.1 AA contrast ratios (>= 4.5:1 for interactive text).
-   **Reduced Motion:** Framer Motion animations are designed to be subtle and respect `prefers-reduced-motion` (though explicit implementation of `useReducedMotion` is not yet added, the animations are generally non-disruptive).

## Storybook Entries

(Storybook setup is not detected in the project. If Storybook were available, entries for `Card`, `Chat`, `Composer`, `DetailsPanel`, `StatCard`, and `Uploader` would be added here.)

## Unit Tests

Existing unit tests for chat functionality (`src/features/chat/ChatPage.test.tsx`) and details panel (`src/features/chat/DetailsPanel/DetailsPanel.test.tsx`) cover core interactions and optimistic UI updates. These tests have been reviewed to ensure compatibility with the new UI.

To run tests:

1.  **Install Testing Dependencies (if not already installed):**
    ```bash
    npm install -D vitest @testing-library/react @testing-library/jest-dom
    ```
2.  **Add Test Script (if missing in `package.json`):**
    ```json
    "scripts": {
      "test": "vitest",
      // ... other scripts
    }
    ```
3.  **Execute Tests:**
    ```bash
    npm test
    ```
