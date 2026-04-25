# 🥊 UFC Betting Tracker

Real-time betting tracker for UFC events with Firebase Realtime Database synchronization.

## Features

✅ Real-time synchronization between users
✅ Firebase Realtime Database backend
✅ Beautiful, responsive design
✅ Automatic point calculation
✅ Support for multiple fight cards

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ufc-betting.git
cd ufc-betting
```

### 2. Open in browser
Simply open `index.html` in your web browser.

### 3. Share the link
Deploy to Vercel (see below) and share the URL with your betting partner.

## Deployment to Vercel

### Option 1: Connect GitHub to Vercel (Easiest)

1. Push this repo to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project"
4. Select "Import Git Repository"
5. Choose this repo
6. Click "Deploy"
7. Done! You'll get a live URL

### Option 2: Deploy directly
```bash
npm i -g vercel
vercel login
vercel
```

## Firebase Setup

This project uses Firebase Realtime Database for live synchronization.

### Configure Firebase

Replace the `firebaseConfig` in `index.html` with your own Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

Get these from Firebase Console → Project Settings.

## How It Works

1. Each user opens the live URL
2. When someone makes a prediction, it's saved to Firebase
3. Both users see updates in real-time
4. Points are calculated automatically
5. The person with the most points buys hamburgers 🍔

## Technologies

- React 18 (via CDN)
- Firebase Realtime Database
- Tailwind CSS
- Vercel Hosting

## License

MIT