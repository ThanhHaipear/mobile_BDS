# BDS Mobile

BDS Mobile is a real-estate marketplace mobile application built with Expo and React Native. The app allows users to browse property listings as guests, sign in to save listings, create and manage posts, pin property locations on a map, interact through comments and ratings, and manage their personal profile.

This project was built as the mobile client for a real-estate platform, with API integration, JWT authentication, map-based location selection, image upload, and user engagement features.

## Key Features

- Public listing feed for guests, with search, transaction filters, category display, pull-to-refresh, and lazy loading.
- Listing detail screen with image carousel, property metadata, owner profile, contact action, map navigation, comments, replies, and star ratings.
- Authentication flow with login, registration, forgot password, JWT token storage, refresh-token handling, and biometric quick login.
- Create and edit property posts with form validation, image picker, category/post-type selection, detailed property attributes, and map pinning.
- Owner post management with filters for approved, pending, rejected, hidden, and all posts.
- Owner actions for editing, deleting, hiding, and showing listings.
- Favorites system for saving and removing property listings.
- Profile management with avatar upload, personal information update, phone and CCCD validation, password change, and logout.
- VIP membership flow with membership status display and upgrade initialization via payment QR link.
- Local Vietnamese administrative location data with province, district, and ward fallback support.
- AI chatbot modal integrated with backend chatbot endpoint.

## Tech Stack

- **Mobile:** React Native, Expo SDK 54
- **Navigation:** React Navigation Native Stack, Bottom Tabs
- **State and storage:** React Context, AsyncStorage, Expo SecureStore
- **Networking:** Axios with request/response interceptors
- **Maps and location:** React Native Maps, Expo Location
- **Media:** Expo Image Picker
- **Authentication UX:** Expo Local Authentication
- **UI:** React Native components, Expo Vector Icons
- **Tooling:** ESLint, TypeScript config, npm

## Main User Flows

1. **Guest browsing**
   - Users can open the app and browse approved property listings without logging in.
   - Search and filters help narrow listings by keyword, transaction type, and location.

2. **Authentication**
   - Users can register, log in, recover password, and use biometric login after their first successful login.
   - Access and refresh tokens are persisted locally and attached automatically to API requests.

3. **Posting a property**
   - Authenticated users can create a listing, select category and transaction type, enter price/area/details, upload images, and pin a map location.
   - Existing listings can be edited from the owner management screen.

4. **Listing engagement**
   - Users can save favorite listings, comment, reply to comments, and submit star ratings.
   - Detail screens show rating summaries and owner contact information.

5. **Account management**
   - Users can update profile information, upload avatar, change password, view saved listings, review their ratings, and manage VIP membership status.

## Project Structure

```text
BDS_mobile/
|-- App.js
|-- app.json
|-- package.json
|-- assets/
|   |-- images/
|   `-- locations/
|       |-- provinces.json
|       |-- districts/
|       `-- wards/
|-- src/
|   |-- api/
|   |   |-- client.js
|   |   `-- endpoints.js
|   |-- components/
|   |   |-- common/
|   |   `-- features/
|   |-- context/
|   |   `-- AuthContext.js
|   |-- navigation/
|   |   |-- HomeStack.js
|   |   |-- MainTabNavigator.js
|   |   |-- PostStack.js
|   |   `-- ProfileStack.js
|   |-- screens/
|   |   |-- Auth/
|   |   |-- Home/
|   |   |-- Post/
|   |   |-- Profile/
|   |   `-- Notification/
|   `-- utils/
|       |-- locations.js
|       |-- districtsIndex.js
|       `-- wardsIndex.js
`-- tools/
    `-- generate-location-index.js
```

## API Integration

The app communicates with a backend API through `src/api/client.js` and endpoint constants in `src/api/endpoints.js`.

Current configured base URL:

```js
baseURL: 'http://10.218.14.21:8000'
```

Before running the app on another machine or network, update this value to match your backend server IP/domain.

Main API groups used by the app:

- Accounts: login, register, profile, avatar upload, password change, forgot password.
- Listings: list posts, post detail, create/update/delete posts, owner posts, owner status.
- Engagement: favorites, comments, ratings.
- Membership: current membership status and VIP upgrade initialization.
- Chatbot: AI assistant endpoint.

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI or `npx expo`
- Android Studio emulator, iOS Simulator, or Expo Go
- Backend API server running and reachable from the mobile device/emulator

### Installation

```bash
npm install
```

### Run the App

```bash
npm start
```

Then choose one of the Expo options:

```bash
npm run android
npm run ios
npm run web
```

For Android physical devices, make sure the backend IP in `src/api/client.js` is reachable from the same Wi-Fi network.

## Available Scripts

```bash
npm start        # Start Expo development server
npm run android  # Open on Android
npm run ios      # Open on iOS
npm run web      # Open on web
npm run lint     # Run Expo lint
```

## Location Data

The project includes local Vietnam province, district, and ward JSON data under `assets/locations`. The helper in `src/utils/locations.js` provides fallback location lists when API location endpoints are unavailable.

To regenerate location indexes:

```bash
node tools/generate-location-index.js
```

## Portfolio Highlights

- Built a complete React Native mobile client for a real-estate marketplace.
- Implemented authenticated and guest user flows with route gating.
- Integrated JWT access/refresh token handling using Axios interceptors.
- Added property posting with multipart image upload and map-based coordinate picking.
- Built listing engagement features including favorites, comments, replies, and ratings.
- Designed profile, avatar upload, password change, and VIP membership screens.
- Organized app navigation with bottom tabs and nested native stacks.

## Repository

GitHub: [ThanhHaipear/mobile_BDS](https://github.com/ThanhHaipear/mobile_BDS.git)
