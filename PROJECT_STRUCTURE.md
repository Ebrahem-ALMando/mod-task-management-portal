# Project Structure Documentation

## 1️⃣ Project Overview

This project is a **static government web portal** built with Next.js (App Router) that serves as a centralized links portal for the Syrian Ministry of Defense. The application functions as a Progressive Web App (PWA) with offline support.

### What Problem It Solves

The portal provides a single entry point for accessing various ministry services and links, organized as clickable cards. It is designed to work reliably even when network connectivity is limited or unavailable.

### How It Works

The application is built as a static site using Next.js with static export (`output: 'export'`). It generates static HTML at build time. The app shell architecture ensures that core assets (HTML, CSS, JavaScript, icons) are cached by a Service Worker, allowing the application to function offline. The UI displays a grid of link cards, each representing a different ministry service or department. Users can click cards to access external links, with offline detection and placeholder link handling.

---

## 2️⃣ Folder Structure

### Root Level

```
syrian-ministry-of-defense-links-portal/
├── src/                    # Source code
├── public/                 # Static assets served directly
├── out/                    # Build output (static export)
├── scripts/                # Build-time utility scripts
├── node_modules/          # Dependencies
├── package.json           # Project configuration and dependencies
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.mjs     # PostCSS configuration
├── eslint.config.mjs      # ESLint configuration
├── components.json        # shadcn/ui component configuration
├── README.md              # Project readme (Arabic)
└── ARCHITECTURE.md        # Architecture notes (Arabic)
```

### `src/` Directory

The main source code directory contains all application logic and components.

#### `src/app/`

**Purpose**: Next.js App Router directory containing route definitions and root layout.

**Contents**:
- `layout.tsx` - Root layout component (Server Component) that wraps all pages
- `page.tsx` - Home page component (Server Component)
- `metadata.ts` - SEO and metadata configuration
- `globals.css` - Global styles and theme variables
- `favicon.ico` - Site favicon

**Responsibility Boundaries**:
- Defines the HTML structure (`<html>`, `<body>`)
- Sets up theme provider and app shell
- Contains page-level routing structure
- Does not contain business logic or UI component implementations

#### `src/components/`

**Purpose**: Reusable React components organized by functional area.

**Subdirectories**:

##### `components/layout/`
- **Purpose**: Structural components that define page layout
- **Contents**:
  - `AppShell/` - Technical wrapper that registers Service Worker (no visual output)
  - `Header/` - Page header with logo and ministry title
  - `ManifestLink.tsx` - Link to PWA manifest
- **Responsibility**: Page structure and technical initialization

##### `components/branding/`
- **Purpose**: Brand identity components
- **Contents**:
  - `Logo/` - Ministry logo component with responsive sizing
  - `MinistryTitle/` - SVG-based ministry title text
- **Responsibility**: Visual branding elements

##### `components/cards/`
- **Purpose**: Link card components for displaying ministry services
- **Contents**:
  - `LinkCard/` - Individual clickable link card with icon and title
  - `LinksGrid/` - Grid container that renders multiple LinkCard components
- **Responsibility**: Display and interaction with ministry links

##### `components/status/`
- **Purpose**: Status indicators and system controls
- **Contents**:
  - `StatusBar/` - Container for status badges (positioning and layout)
  - `OfflineIndicator/` - Network connectivity status badge
  - `ThemeToggle/` - Light/dark theme switcher button
- **Responsibility**: System status display and user preferences

##### `components/dialogs/`
- **Purpose**: Modal dialogs for user interactions
- **Contents**:
  - `LinkDialog/` - Dialog shown when clicking placeholder links or offline links
- **Responsibility**: User feedback and interaction flows

##### `components/icons/`
- **Purpose**: SVG icon components
- **Contents**: Individual icon components (ShieldIcon, UserIcon, DocumentIcon, etc.)
- **Responsibility**: Reusable iconography with consistent styling

##### `components/ui/`
- **Purpose**: Base UI components from shadcn/ui
- **Contents**:
  - `badge.tsx`
  - `button.tsx`
  - `card.tsx`
  - `dialog.tsx`
  - `toast.tsx`
- **Responsibility**: Low-level UI primitives

##### `components/theme-provider.tsx`
- **Purpose**: Wrapper around next-themes ThemeProvider
- **Responsibility**: Theme context provider setup

#### `src/config/`

**Purpose**: Configuration files containing application data and settings.

**Contents**:
- `app.config.ts` - Application configuration (currently empty)
- `links.config.ts` - Array of ministry links (`MINISTRY_LINKS`) with id, title, url, and icon

**Responsibility**: Centralized data storage separate from component logic. Links can be modified here without touching component code.

#### `src/hooks/`

**Purpose**: Custom React hooks for reusable stateful logic.

**Contents**:
- `useNetworkStatus/` - Hook that monitors online/offline status using browser `navigator.onLine` API and window event listeners

**Responsibility**: Encapsulates network status detection logic for use across components.

#### `src/lib/`

**Purpose**: Utility libraries and helper functions.

**Subdirectories**:

##### `lib/pwa/`
- **Purpose**: Progressive Web App utilities
- **Contents**:
  - `registerServiceWorker.ts` - Function to register the Service Worker on page load
  - `sw.constants.ts` - Cache version constants used by Service Worker

##### `lib/utils/`
- **Purpose**: General utility functions
- **Contents**:
  - `cn.ts` - Class name utility (likely using `clsx` and `tailwind-merge`)
  - `utils.ts` - Additional utility functions

**Responsibility**: Technical utilities that support application functionality but are not UI components.

#### `src/types/`

**Purpose**: TypeScript type definitions.

**Contents**:
- `link.ts` - Type definitions for `LinkItem` interface and `IconType` union type

**Responsibility**: Shared type contracts to ensure type safety across components.

### `public/` Directory

**Purpose**: Static assets served directly by the web server (not processed by Next.js).

**Contents**:
- `sw.js` - Service Worker script (cached and served directly)
- `manifest.webmanifest` - PWA manifest file
- `favicon.ico` - Site favicon
- `asset/` - Fonts and images
  - `font/` - Self-hosted fonts (Tajawal, Qomariah Arabic)
  - `img/` - Images (logos, backgrounds, icons)

**Responsibility**: Static files that must be accessible at known URLs for PWA functionality and asset loading.

### `scripts/` Directory

**Purpose**: Build-time utility scripts.

**Contents**:
- `sync-sw-version.js` - Node.js script that synchronizes `CACHE_VERSION` between `src/lib/pwa/sw.constants.ts` and `public/sw.js`

**Responsibility**: Ensures Service Worker cache version stays consistent across files during build process.

---

## 3️⃣ Component Organization

### Component Grouping Strategy

Components are organized by **functional responsibility** rather than by technical type (UI vs business). This means components that serve the same purpose are grouped together, regardless of their complexity.

### Component Categories

1. **Layout Components** (`components/layout/`)
   - Structural elements that define page structure
   - Examples: `AppShell`, `Header`, `StatusBar`
   - These handle positioning, spacing, and overall page architecture

2. **Branding Components** (`components/branding/`)
   - Visual identity elements
   - Examples: `Logo`, `MinistryTitle`
   - These are presentation-only, no business logic

3. **Business Components** (`components/cards/`, `components/dialogs/`)
   - Components that implement application features
   - Examples: `LinkCard`, `LinksGrid`, `LinkDialog`
   - These contain interaction logic and state management

4. **Status Components** (`components/status/`)
   - System status and user preference controls
   - Examples: `OfflineIndicator`, `ThemeToggle`
   - These monitor and display system state

5. **Icon Components** (`components/icons/`)
   - Reusable SVG icon components
   - These are pure presentation, accepting className and gradientId props

6. **UI Primitives** (`components/ui/`)
   - Base components from shadcn/ui library
   - Low-level building blocks (buttons, dialogs, cards)
   - These are styled but logic-agnostic

### Naming Conventions

- **Component files**: PascalCase (e.g., `LinkCard.tsx`, `StatusBar.tsx`)
- **Component directories**: PascalCase matching component name (e.g., `LinkCard/`, `StatusBar/`)
- **Index files**: Each component directory contains an `index.ts` file that exports the component
- **Type files**: Component-specific types are in `ComponentName.types.ts` files (e.g., `LinkCard.types.ts`)
- **Hooks**: camelCase with "use" prefix (e.g., `useNetworkStatus.ts`)
- **Utilities**: camelCase (e.g., `cn.ts`, `utils.ts`)

### Component Structure Pattern

Most components follow this structure:
```
ComponentName/
├── index.ts              # Exports the component
├── ComponentName.tsx     # Main component file
└── ComponentName.types.ts # Type definitions (if needed)
```

---

## 4️⃣ Data Fetching & API Layer

### Data Source

**No API calls exist in this application.** All data is static and defined at build time.

### Data Location

- **Links data**: Defined in `src/config/links.config.ts` as a constant array `MINISTRY_LINKS`
- **Configuration**: Application settings in `src/config/app.config.ts` (currently empty)
- **Metadata**: SEO and page metadata in `src/app/metadata.ts`

### Data Flow

1. Links are imported from `links.config.ts` into `LinksGrid` component
2. `LinksGrid` maps over the array and renders `LinkCard` components
3. Each `LinkCard` receives link data as props (id, title, url, icon)
4. No runtime data fetching occurs

### External Links

- Links point to external URLs (e.g., `https://google.com` or placeholder `#`)
- When clicked, links open in new tabs via `window.open(url, '_blank')`
- No authentication tokens are used
- No API authentication is implemented

### Caching

- Static data is bundled into the JavaScript at build time
- No runtime caching of API responses (no API exists)
- Service Worker caches static assets (HTML, CSS, JS), not data

---

## 5️⃣ State Management

### State Types

The application uses **local component state** only. There is no global state management library.

### State Locations

1. **Component State** (React `useState`)
   - `LinkCard`: Manages dialog open/close state and toast visibility
   - `OfflineIndicator`: Tracks reconnection animation states and previous offline status
   - `ThemeToggle`: Tracks mounted state and initial theme to prevent hydration mismatches

2. **Hook-Based State** (`useNetworkStatus`)
   - Network connectivity status (online/offline)
   - Exposed as a hook to be consumed by multiple components
   - Uses browser `navigator.onLine` API and window event listeners

3. **Theme State** (`next-themes`)
   - Managed by `next-themes` library via `ThemeProvider`
   - Stored in browser localStorage
   - Accessed via `useTheme()` hook from `next-themes`

### State Flow

- **Top-down**: Props are passed from parent to child components
- **No state lifting**: Each component manages its own local state
- **Shared state**: Network status is shared via custom hook, theme via context provider
- **No global store**: No Redux, Zustand, or similar state management library

### State Libraries

- **React**: Built-in `useState`, `useEffect` hooks
- **next-themes**: Theme management (light/dark mode)
- **No additional state management libraries**

---

## 6️⃣ Caching Strategy

### Cache Strategy: **Cache-First with Network Fallback**

The Service Worker implements a **cache-first** strategy for same-origin requests.

### Where Caching Happens

1. **Service Worker** (`public/sw.js`)
   - Primary caching mechanism
   - Uses browser Cache API
   - Cache name: `app-shell-{CACHE_VERSION}` (currently `app-shell-v6`)

2. **Browser Cache**
   - Standard HTTP caching for assets
   - Next.js static export generates cacheable static files

3. **No Application-Level Caching**
   - No React Query, SWR, or similar data fetching libraries
   - No localStorage/sessionStorage for application data
   - Only theme preference stored in localStorage (via next-themes)

### When Cached Data is Served

1. **Install Event**: Service Worker precaches critical assets (`/`, `/index.html`, `/manifest.webmanifest`) during installation

2. **Fetch Event**: 
   - For same-origin requests, Service Worker checks cache first
   - If cached response exists, it is returned immediately
   - If not cached, network request is made
   - Successful network responses are cached for future use

3. **Special Handling**:
   - Icons and favicons use **Network-First with Cache Fallback**: Try network first, fall back to cache if offline
   - Documents (HTML pages) fall back to cached `/` if network fails

### How Updates are Handled

1. **Cache Versioning**: 
   - Cache version is defined in `src/lib/pwa/sw.constants.ts` as `CACHE_VERSION = 'v6'`
   - Build script (`scripts/sync-sw-version.js`) syncs this version to `public/sw.js` before build

2. **Activation Event**:
   - When new Service Worker activates, it deletes all caches with prefix `app-shell-` that don't match current version
   - Old cache is purged, new cache is created

3. **Update Flow**:
   - User visits site → new Service Worker installs in background
   - On next page load/navigation, new Service Worker activates
   - Old cache is deleted, new assets are cached
   - `skipWaiting()` ensures immediate activation (no waiting for all tabs to close)

### Offline Behavior

- **Online**: Network requests are made, responses are cached
- **Offline**: Cached responses are served from Service Worker cache
- **Fallback**: If document request fails and no cache exists, returns generic "Offline" response
- **Icons/Favicons**: Network-first, but falls back to cache if offline

---

## 7️⃣ Service Worker / PWA

### Service Worker Location

- **File**: `public/sw.js`
- **Registration**: Registered in `src/components/layout/AppShell/AppShell.tsx` via `registerServiceWorker()` function from `src/lib/pwa/registerServiceWorker.ts`
- **Registration Timing**: Registered on window `load` event (after page loads)

### What It Caches

**Precached Assets** (installed during Service Worker installation):
- `/` (root HTML)
- `/index.html`
- `/manifest.webmanifest`

**Runtime Caching** (cached as requests are made):
- All same-origin requests (HTML, CSS, JS, images, fonts)
- Icons and favicons (with special network-first handling)

### Caching Strategy

1. **Install Event**: 
   - Opens cache `app-shell-v6`
   - Attempts to precache critical assets
   - Calls `skipWaiting()` to activate immediately

2. **Activate Event**:
   - Deletes old caches (any cache starting with `app-shell-` that isn't current version)
   - Claims all clients immediately (`clients.claim()`)

3. **Fetch Event**:
   - **Same-origin only**: Only intercepts requests to same origin (ignores external URLs)
   - **Icons/Favicons**: Network-first strategy (try network, cache response, fallback to cache)
   - **All other requests**: Cache-first strategy (check cache, return if found, otherwise fetch and cache)
   - **Offline fallback**: For document requests, falls back to cached `/` if network fails

### Offline Behavior

- **App Shell**: Core HTML, CSS, JS are cached and available offline
- **Assets**: Images, fonts, icons are cached on first load and available offline
- **External Links**: Clicking links to external sites requires network (not cached by Service Worker)
- **Placeholder Links**: Links with `url === '#'` show dialog instead of navigating
- **Offline Detection**: `useNetworkStatus` hook detects offline state and shows indicator

### PWA Manifest

- **File**: `public/manifest.webmanifest`
- **Configuration**: Defines app name, icons, theme colors, display mode (`standalone`)
- **Referenced**: In `src/app/metadata.ts` and via `<link rel="manifest">` in layout
- **Icons**: Points to `/asset/img/logo_with_bg.png` in multiple sizes

---

## 8️⃣ Styling System

### How Styles Are Applied

1. **Tailwind CSS**: Primary styling method using utility classes
2. **Global CSS**: Custom CSS in `src/app/globals.css` for:
   - CSS custom properties (theme variables)
   - Font face declarations
   - Custom utility classes
   - Component-specific styles (link cards, status badges)
   - Animations and keyframes

### Tailwind Usage

- **Configuration**: Tailwind v4 with PostCSS
- **Utility Classes**: Components use Tailwind utility classes extensively (e.g., `flex`, `items-center`, `bg-card`)
- **Custom Theme**: Extended with custom colors and design tokens via CSS variables
- **Responsive**: Uses Tailwind breakpoints (`md:`, `lg:`)
- **Dark Mode**: Uses `dark:` variant (configured via `@custom-variant dark`)

### Theme Handling

**Theme System**: `next-themes` library

**Theme Modes**:
- `light` - Light mode (default)
- `dark` - Dark mode
- `system` - Respects system preference (enabled via `enableSystem` prop)

**Theme Implementation**:
- Theme is applied via `class` attribute on `<html>` element (set by `next-themes`)
- CSS variables in `globals.css` define colors for both themes
- `:root` defines light mode variables
- `.dark` selector defines dark mode overrides
- Components use CSS variables (e.g., `var(--background)`, `var(--foreground)`) for theme-aware colors

**Theme Variables** (defined in `globals.css`):
- Brand colors: `--color-brand-primary`, `--color-brand-gold`
- Semantic colors: `--background`, `--foreground`, `--card`, `--primary`, etc.
- Status colors: `--status-online`, `--status-offline`
- Icon gradients: `--icon-gradient-start`, `--icon-gradient-end`

### Custom CSS

**Font System**:
- Primary: Alexandria (system font, fallback)
- Secondary: Tajawal (self-hosted, multiple weights)
- Display: Qomariah Arabic (for ministry title, self-hosted)

**Custom Classes** (defined in `globals.css`):
- `.bg-pattern` - Background star pattern image
- `.bg-pattern-overlay` - Overlay for background readability
- `.link-card` - Link card styling with gradient border
- `.link-card-title` - Typography for card titles
- `.status-badge` - Status indicator badge styling
- `.theme-toggle-badge` - Theme toggle button styling
- `.ministry-title` - Ministry title typography
- `.logo-container` - Logo hover effects
- Animation classes: `.fade-in`, `.zoom-in-95`, `.wifi-wave`, etc.

**Component-Specific Styles**:
- Link cards have gradient borders and hover effects
- Status badges have theme-adaptive shadows
- Icons use SVG gradients defined in CSS variables

### No CSS-in-JS

- No styled-components, emotion, or similar libraries
- All styles are in CSS files or Tailwind utilities
- CSS variables used for theme values

---

## 9️⃣ Authentication Flow

### Authentication Status

**No authentication system exists in this application.**

### Login/Logout

- Not implemented
- No login pages or authentication UI
- No user accounts or sessions

### Token Storage

- No authentication tokens
- No token management
- No secure storage mechanisms

### Protected Routes

- No protected routes
- All content is publicly accessible
- No route guards or authentication checks

### User Identity

- No user identification
- No user profiles
- Application is anonymous/public

### Future Considerations

The architecture does not include authentication infrastructure. If authentication is needed in the future, it would require:
- Adding authentication provider (e.g., NextAuth.js, custom solution)
- Implementing login/logout flows
- Adding protected route middleware
- Token storage and management
- User session handling

---

## 🔟 Summary

### What This Project Is Good At

1. **Static Site Generation**: Efficiently generates static HTML at build time for fast loading
2. **Offline Functionality**: Reliable offline operation via Service Worker caching
3. **Simple Architecture**: Clear separation of concerns with minimal complexity
4. **Theme Support**: Robust light/dark theme system with system preference detection
5. **RTL Support**: Built-in right-to-left (Arabic) language support
6. **PWA Features**: Installable as a web app with manifest and Service Worker
7. **Type Safety**: TypeScript throughout for compile-time error detection
8. **Component Reusability**: Well-organized components that can be easily reused

### Implicit Architectural Assumptions

1. **Static Data**: Assumes all data is known at build time (no dynamic content)
2. **No Backend**: Assumes no server-side API or database (fully static)
3. **Client-Side Only**: Assumes all interactivity happens in the browser
4. **Same-Origin Assets**: Service Worker only caches same-origin requests (external links not cached)
5. **Modern Browser**: Assumes modern browser support (Service Worker, CSS Grid, etc.)
6. **Arabic-First**: Assumes primary language is Arabic (RTL layout, Arabic text)
7. **Government Context**: Assumes formal, professional UI suitable for government use

### Important Things a New Developer Must Know

1. **Static Export**: Project uses `output: 'export'` in `next.config.ts`, meaning it generates static files only. No server-side features (API routes, middleware, etc.) can be used.

2. **Service Worker Version Sync**: Cache version must be kept in sync between `src/lib/pwa/sw.constants.ts` and `public/sw.js`. The build script handles this, but manual edits to `sw.js` may break sync.

3. **Component Organization**: Components are grouped by function, not type. Look for components by what they do, not whether they're "UI" or "business" components.

4. **No API Calls**: All data comes from config files. To add/modify links, edit `src/config/links.config.ts`, not a database or API.

5. **Theme Variables**: Colors are defined in CSS variables in `globals.css`. To change colors, modify the `:root` and `.dark` selectors, not individual components.

6. **RTL Layout**: Layout is right-to-left by default (`dir="rtl"` in root HTML). Be mindful of positioning (right/left are reversed from LTR).

7. **Client Components**: Many components are marked `'use client'` because they use hooks or browser APIs. Server Components are used only in `app/` directory where possible.

8. **Build Process**: Run `npm run build` to generate static files in `out/` directory. The `prebuild` script syncs Service Worker version automatically.

9. **Icon System**: Icons are SVG components that accept `gradientId` prop for unique gradient definitions. Each icon instance needs a unique `gradientId` to avoid conflicts.

10. **Network Status**: Offline detection uses browser `navigator.onLine` API, which may not detect all network issues (e.g., connected but no internet). The Service Worker provides actual offline functionality.
