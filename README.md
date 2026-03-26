# Music Player App

A React Native music player app built with Expo that streams music from JioSaavn API and supports offline downloads.

## Table of Contents
- [Setup](#setup)
- [Architecture](#architecture)
- [Trade-offs](#trade-offs)
- [Improvements & Future Scope](#improvements--future-scope)

---

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Expo Go app (for testing) OR Android Studio/Xcode (for building)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run:android

# Run on iOS
npm run:ios
```

### Environment Requirements
- Expo SDK 55
- React Native 0.83
- TypeScript 5.9

---

## Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│  (Navigation, Redux Provider, Audio Setup, Downloads)    │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
   ┌────▼────────────┐       ┌────▼────────────┐
   │  Tab Navigator  │       │ Stack Navigator │
   │  - Home         │       │ - PlayerScreen  │
   │  - Downloads    │       │ - SearchScreen  │
   │  - Favourites   │       └──────────────────┘
   │  - Settings     │
   │  - Queue        │
   └─────────────────┘
```

### Tech Stack
| Category | Technology |
|----------|------------|
| Framework | Expo (React Native) |
| Language | TypeScript |
| State Management | Redux Toolkit |
| Navigation | React Navigation v7 |
| Audio | expo-audio |
| Storage | expo-file-system, AsyncStorage |
| API | JioSaavn (via axios) |

### Directory Structure

```
src/
├── App.tsx                    # Main app, navigation setup, audio init
├── store/
│   ├── index.ts               # Redux store configuration
│   └── slices/
│       └── playerSlice.ts     # Player state (queue, position, repeat, shuffle)
├── services/
│   ├── AudioService.ts        # Audio playback singleton (expo-audio wrapper)
│   ├── saavnApi.ts            # JioSaavn API client
│   ├── downloadService.ts     # Offline downloads (expo-file-system)
│   └── queueStorage.ts        # Queue persistence (AsyncStorage)
├── hooks/
│   ├── useAudioPlayer.ts      # Hook connecting Redux to AudioService
│   ├── useSongs.ts            # Song fetching with pagination
│   ├── useAlbums.ts           # Album fetching
│   ├── useArtists.ts          # Artist fetching
│   └── useSuggestedMusic.ts   # Suggested music fetching
├── components/
│   ├── MiniPlayer.tsx         # Bottom mini player bar
│   ├── VerticalList.tsx       # Song list component
│   ├── HorizontalScrollSection.tsx
│   ├── QueueLoader.tsx        # Loads saved queue on startup
│   ├── QueuePersistence.tsx   # Auto-saves queue changes
│   └── home/                  # Home screen components
├── screens/
│   ├── PlayerScreen.tsx       # Full player with controls, download button
│   └── SearchScreen.tsx       # Search functionality
└── tabs/
    ├── Home.tsx               # Home tab
    ├── Downloads.tsx          # Offline downloads management
    ├── Favourites.tsx         # Favourites tab
    ├── Settings.tsx           # Settings tab
    └── Playlists.tsx          # Queue/Playlists tab
```

### Key Design Patterns

1. **Singleton Services**: `AudioService` and `downloadService` are singletons for global audio control and download management.

2. **Redux + Hooks**: State is managed in Redux, with `useAudioPlayer` hook connecting UI to audio playback.

3. **Polling for Progress**: Audio progress is tracked via `setInterval` polling (500ms) since expo-audio doesn't have native event listeners for progress.

4. **Offline-First Audio**: `AudioService.play()` checks for local file first, then falls back to streaming URL.

---

## Trade-offs

### Reasons for Trade-offs
*Limited development time prioritized core functionality delivery.*

### 1. Polling Instead of Events for Progress
**Trade-off**: Using `setInterval` polling (500ms) for audio progress instead of native events.
- **Why**: expo-audio's current API doesn't expose progress events.
- **Impact**: Minor battery usage, slight overhead, but works reliably.
- **Time Saved**: Avoided building custom native module for progress events.

### 2. Basic Error Handling
**Trade-off**: Console.log-based error handling without user-facing error states.
- **Why**: Time constraints; full error states require UI components and state management.
- **Impact**: Users don't see graceful error messages on network/API failures.
- **Time Saved**: Skipped building error context, retry UI, and error boundaries.

### 3. No Offline Mode Indicator
**Trade-off**: App doesn't detect offline state to show cached content automatically.
- **Why**: Would need network state listener and content filtering logic.
- **Impact**: Users must manually navigate to Downloads tab for offline content.
- **Time Saved**: Skipped NetInfo integration and offline content filtering.

### 4. Polling-Based Queue Persistence
**Trade-off**: Queue is saved on every change using effect, not debounced.
- **Why**: Simpler to implement; debouncing requires additional utilities.
- **Impact**: More AsyncStorage writes, slightly less efficient.
- **Time Saved**: Skipped implementing debounce/throttle logic.

### 5. Basic Metadata in Downloads
**Trade-off**: Downloaded songs show basic metadata (title, artist, image) but no album info.
- **Why**: Metadata structure kept simple; album data wasn't needed for playback.
- **Impact**: Less info in Downloads screen, but sufficient for user needs.
- **Time Saved**: No need to extend metadata type or update API integration.

### 6. No Loading States in Downloads
**Trade-off**: Downloads screen loads synchronously without loading spinners.
- **Why**: File system operations are fast enough; loading state felt unnecessary.
- **Impact**: Slightly less polished UX during initial load.
- **Time Saved**: Skipped loading state management.

### 7. Single API Implementation
**Trade-off**: Only JioSaavn API integrated; no fallback for other music sources.
- **Why**: Time spent on making API abstraction layer vs implementing one working API.
- **Impact**: Limited music source, but fully functional with available data.
- **Time Saved**: No need to build provider pattern for multiple APIs.

---

## Improvements & Future Scope

### UI/UX Improvements

| Priority | Improvement | Description |
|----------|-------------|-------------|
| High | Dark Mode | Add dark theme toggle in Settings |
| High | Animated Player | Add album art rotation, animations when playing |
| High | Better Empty States | Custom illustrations for empty downloads/favourites |
| Medium | Progress Slider | Add scrubbing preview while seeking |
| Medium | Queue Reorder UI | Drag-and-drop queue management UI |
| Low | Album Art Blur | Add blurred backdrop from album art in player |
| Low | Animated Transitions | Smooth page transitions between screens |
| Low | Haptic Feedback | Add vibration on button presses |

### Feature Improvements

| Priority | Feature | Description |
|----------|---------|-------------|
| High | Offline Mode Detection | Show offline indicator, filter content when no network |
| High | Storage Management | Show total download size, auto-delete old songs |
| Medium | Background Downloads | Continue downloading when app is backgrounded |
| Medium | Favourites Sync | Persist favourited songs to local storage |
| Medium | Search History | Save recent searches for quick access |
| Low | Media Controls | Add to system media controls (lock screen) |
| Low | Share Song | Share song details or link externally |
| Low | Queue Export | Export/import queue as playlist |

### Technical Improvements

| Priority | Improvement | Description |
|----------|-------------|-------------|
| High | Debounce Queue Save | Debounce queue persistence writes |
| High | Error Boundaries | Add React error boundaries for graceful failures |
| Medium | Audio Events | Build native module for real audio progress events |
| Medium | Image Caching | Cache album art for better offline support |
| Medium | Bundle Size | Code-split navigation, lazy load components |
| Low | Testing | Add unit tests for services, integration tests for flows |
| Low | TypeScript Strict | Enable strict mode, add proper types everywhere |

### Architecture Improvements

| Priority | Improvement | Description |
|----------|-------------|-------------|
| Medium | API Abstraction | Create provider interface for swappable music APIs |
| Medium | Offline-First Data | Add local database (SQLite/WatermelonDB) for songs |
| Low | Clean Architecture | Separate UI/Business Logic/Data layers more strictly |
| Low | State Persistence | Persist more state (repeat mode, shuffle, current position) |

---

## License

MIT License