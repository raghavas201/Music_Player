# Mume - Music Player App

A beautiful, feature-rich music streaming app built with React Native, Expo, and TypeScript. Powered by JioSaavn API.

## 📸 Features

✨ **Core Features:**
- 🎵 Song search and browsing
- 🎯 Full player with controls (play, pause, skip, seek)
- 📱 Persistent mini-player at bottom
- ❤️ Favorites management
- 📋 Queue management with reordering
- 🔀 Shuffle and repeat modes
- 🎚️ Volume and progress control
- 🌙 Dark mode (primary) with light mode support

🎨 **UI/UX:**
- Smooth navigation and animations
- Responsive design for all screen sizes
- Beautiful album artwork display
- Intuitive tab-based navigation
- Context menus for song actions
- Sort options for songs list

🔌 **API Integration:**
- JioSaavn API integration (no API key required)
- Search songs, artists, albums
- Get artist details and discography
- Song suggestions and recommendations

💾 **Storage:**
- MMKV for fast local storage
- Persist favorites and queue
- Offline queue management
- Remember user preferences

## 📋 Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Zustand
- **Storage:** MMKV (React Native MMKV)
- **Navigation:** React Navigation v6+
- **API Client:** Axios
- **UI Components:** React Native built-ins + Expo Icons
- **Styling:** StyleSheet (built-in)

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

## 🏗️ Project Structure

```
mume-music-player/
├── src/
│   ├── navigation/
│   │   └── RootNavigator.tsx      # Main navigation setup
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Home with popular songs/artists
│   │   ├── SongsScreen.tsx        # Songs search and list
│   │   ├── ArtistsScreen.tsx      # Artists browsing
│   │   ├── FavoritesScreen.tsx    # Saved favorites
│   │   ├── PlayerScreen.tsx       # Full player view
│   │   └── SettingsScreen.tsx     # App settings
│   ├── components/
│   │   ├── SongCard.tsx           # Song list item component
│   │   ├── ArtistCard.tsx         # Artist list item component
│   │   └── MiniPlayer.tsx         # Bottom mini player
│   ├── services/
│   │   └── saavnService.ts        # JioSaavn API service
│   ├── stores/
│   │   └── playerStore.ts         # Zustand player state
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   └── utils/
│       └── colors.ts              # Design tokens and colors
├── App.tsx                        # Entry point
├── app.json                       # Expo configuration
├── package.json                   # Dependencies
└── tsconfig.json                  # TypeScript configuration
```

## 🎯 Key Features Explained

### 1. **Search & Browse**
- Search songs across JioSaavn's catalog
- Browse by songs, artists, albums
- Sort results (ascending, descending, by artist, album, etc.)
- Pagination support

### 2. **Player Controls**
- Play/Pause functionality
- Skip to next/previous song
- Seek bar to jump to specific time
- Volume control
- Shuffle mode (randomize queue)
- Repeat modes (off, all, one)
- 10-second skip forward/backward buttons

### 3. **Queue Management**
- Add songs to queue
- Reorder queue items
- Remove from queue
- Persistent queue storage
- Auto-play next song

### 4. **Favorites System**
- Heart icon to favorite songs
- Dedicated favorites screen
- Persistent storage
- Quick access to loved songs

### 5. **Mini Player**
- Always visible at bottom
- Shows current song info
- Play/pause controls
- Skip forward button
- Tap to open full player

### 6. **Responsive Design**
- Works on phones and tablets
- Landscape and portrait support
- Touch-optimized controls
- Beautiful animations

## ⚙️ API Integration

The app uses the JioSaavn API (https://saavn.sumit.co/):

```typescript
// Example: Search for songs
const result = await saavnService.searchSongs('arijit singh');

// Example: Get artist details
const artist = await saavnService.getArtistById('459320');

// Example: Get artist songs
const songs = await saavnService.getArtistSongs('459320');
```

**No API key required!** The API is publicly available.

## 🎨 Customization

### Change Primary Color
Edit `src/utils/colors.ts`:
```typescript
export const Colors = {
  primary: '#FF8C00', // Change this to your preferred color
  // ... rest of colors
};
```

### Add More Screens
1. Create new screen in `src/screens/`
2. Add to navigation in `src/navigation/RootNavigator.tsx`
3. Add to tab navigation if needed

### Modify Storage
Edit `src/stores/playerStore.ts` to add/remove stored data:
```typescript
const savedData = storage.getString('key');
storage.set('key', JSON.stringify(data));
```

## 🔄 State Management (Zustand)

The app uses Zustand for simple, scalable state management:

```typescript
import { usePlayerStore } from './src/stores/playerStore';

// In any component
const { currentSong, isPlaying, setIsPlaying } = usePlayerStore();
```

**Key Store Actions:**
- `setCurrentSong()` - Set currently playing song
- `setQueue()` - Update queue
- `setIsPlaying()` - Toggle playback
- `addToFavorites()` - Save favorite
- `toggleShuffle()` - Toggle shuffle mode
- `setRepeat()` - Set repeat mode
- `nextSong()` / `previousSong()` - Navigate queue

## 💾 Local Storage

Using MMKV for ultra-fast storage:

**Stored Data:**
- Current queue
- Favorite songs
- Downloaded songs
- Shuffle state
- Repeat mode
- Player preferences

All data persists between app sessions!

## 📲 Navigation Structure

```
Home (Tab)
├── Home Screen
├── Songs Screen (detail)
├── Artists Screen (detail)
└── Player Screen (modal)

Songs (Tab)
├── Songs List Screen
└── Player Screen

Artists (Tab)
├── Artists List
└── Artist Detail

Favorites (Tab)
├── Favorites List
└── Player Screen

Settings (Tab)
└── Settings Screen
```

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `npm install` again and clear cache:
```bash
npm install
npm start -- --clear
```

### Issue: MMKV not working
**Solution:** Make sure you're on the correct React Native version:
```bash
npx expo install react-native-mmkv
```

### Issue: API calls failing
**Solution:** Check internet connection and API endpoint:
```bash
# Verify API is accessible
curl https://saavn.sumit.co/api/search/songs?query=test
```

### Issue: Songs not playing
**Solution:** Check that audio URLs are accessible and not blocked

## 📚 Learning Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Zustand](https://github.com/pmndrs/zustand)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🚀 Performance Tips

1. **Image Optimization**
   - Images are cached by React Native
   - Consider using `react-native-fast-image` for better caching

2. **List Performance**
   - Use `FlatList` for large song lists (already implemented)
   - Implement pagination for better performance

3. **API Calls**
   - Debounce search input to reduce API calls
   - Cache frequently accessed data

4. **Storage**
   - MMKV is incredibly fast
   - Keep stored data lean and organized

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve! This is a template for building music player apps.

## 📞 Support

- Check the troubleshooting section
- Review code comments for implementation details
- Test with Expo Go app first before building APK

## 🎯 Next Steps

1. **Customize branding:** Change colors, app name, icons
2. **Add features:** Playlists, history, recommendations
3. **Improve UI:** Add animations, transitions, loading states
4. **Backend:** Replace JioSaavn with your own music API
5. **Monetization:** Add ads, premium features, subscriptions

## 📋 Architecture Notes

### State Management Flow
```
User Action → Component → Store (Zustand) → 
MMKV Storage → Re-render
```

### API Flow
```
Search Input → saavnService → API Call → 
Parse Response → Update Store → Display Results
```

### Navigation Flow
```
Bottom Tab → Stack Navigator → Screens →
Modal Player or Detail View
```

## ✅ Checklist for Deployment

- [ ] Update app.json with your info
- [ ] Change app icon and splash screen
- [ ] Test on both Android and iOS
- [ ] Enable push notifications (if needed)
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Create privacy policy
- [ ] Build APK and test thoroughly
- [ ] Submit to app stores

---

**Happy coding! 🎵**

Built with ❤️ using React Native & Expo
