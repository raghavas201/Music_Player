# 🎵 Mume - Music Player App

A beautiful, feature-rich music streaming app built with React Native, Expo, and TypeScript. Powered by JioSaavn API.

## ✨ Features

### 🎵 Core Features
- 🎵 Song search and browsing
- 🎚️ Full player with controls (play, pause, skip, seek)
- 🎶 Persistent mini-player at bottom
- ❤️ Favorites management
- 📋 Queue management with reordering
- 🔀 Shuffle and repeat modes
- 🔊 Volume and progress control
- 🌙 Dark mode (primary) with light mode support

### 🎨 UI/UX
- Smooth navigation and animations
- Responsive design for all screen sizes
- Beautiful album artwork display
- Intuitive tab-based navigation
- Context menus for song actions
- Sort options for songs list

### 🔌 API Integration
- JioSaavn API integration (no API key required)
- Search songs, artists, albums
- Get artist details and discography
- Song suggestions and recommendations

### 💾 Storage
- MMKV for fast local storage
- Persist favorites and queue
- Offline queue management
- Remember user preferences

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React Native with Expo |
| Language | TypeScript |
| State Management | Zustand |
| Storage | MMKV (React Native MMKV) |
| Navigation | React Navigation v6+ |
| API Client | Axios |
| UI Components | React Native built-ins + Expo Icons |
| Styling | StyleSheet (built-in) |

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI (for building APK): `npm install -g eas-cli`

### Installation

1. **Extract the project**
   ```bash
   unzip mume-music-player.zip
   cd mume-music-player
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your device/emulator**
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For Web
   npm run web
   ```

## 📱 Building APK

### Download Ready APK

You can directly download and install the APK from the link below:
- **APK File**: [Download from Google Drive](https://drive.google.com/file/d/1zx-imTZjr1yHTSnONnudA7xDZ6gpPWf7/view?usp=share_link)

### Option 1: Build with EAS (Recommended)

```bash
# Login to EAS
eas login

# Build for Android
npm run build-android

# Build for iOS
npm run build-ios
```

### Option 2: Development APK

```bash
npm start
# Press 'a' in the terminal to open Android Emulator
# Or scan the QR code with Expo Go app
```

## 📁 Project Structure

```
mume-music-player/
├── src/
│   ├── navigation/
│   │   └── RootNavigator.tsx           # Main navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx              # Home with popular songs/artists
│   │   ├── SongsScreen.tsx             # Songs search and list
│   │   ├── ArtistsScreen.tsx           # Artists browsing
│   │   ├── FavoritesScreen.tsx         # Saved favorites
│   │   ├── PlayerScreen.tsx            # Full player view
│   │   └── SettingsScreen.tsx          # App settings
│   ├── components/
│   │   ├── SongCard.tsx                # Song list item component
│   │   ├── ArtistCard.tsx              # Artist list item component
│   │   └── MiniPlayer.tsx              # Bottom mini player
│   ├── services/
│   │   └── saavnService.ts             # JioSaavn API service
│   ├── stores/
│   │   └── playerStore.ts              # Zustand player state
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── utils/
│       └── colors.ts                   # Design tokens and colors
├── App.tsx                              # Entry point
├── app.json                             # Expo configuration
├── package.json                         # Dependencies
└── tsconfig.json                        # TypeScript configuration
```

## 📝 License

This project is built with ❤️ using React Native & Expo.

---

**Happy coding!** 🎉
