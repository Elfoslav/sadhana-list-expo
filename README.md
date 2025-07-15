# 📱 Sadhana List App

https://play.google.com/store/apps/details?id=com.sadhanalist&hl=en

A spiritual habit tracker built with **Expo SDK 53** and **React Native**, designed to help users record and review their daily sadhana (spiritual practices).

## 🚀 Features

- ✅ Modern UI built with React Native
- 🔔 Scheduled push notifications
- ☁️ Firebase Firestore integration
- 🛠 Local storage fallback
- 🗕 Daily tracking of spiritual practices

## 🧑‍💻 Tech Stack

- [Expo SDK 53](https://docs.expo.dev/)
- React Native
- Firebase (Firestore, Notifications)
- TypeScript
- Expo Router
- AsyncStorage

---

## 📦 Installation

```bash
git clone https://github.com/your-username/sadhana-list-app.git
cd sadhana-list-app
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root and add your Firebase config:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🧪 Development

```bash
npx expo start
```

To open in Android Studio emulator or device:

```bash
npx expo run:android
```

---

## 📱 Build

### Android APK (local build)

```bash
npx expo run:android --variant release
```

> Requires Android SDK & environment properly configured.

---

## 📁 Folder Structure

```
.
├── app/                    # App routes and screens
├── src/
│   ├── views/              # UI Views
│   ├── components/         # Reusable components
│   ├── services/           # Firebase & business logic
│   ├── lib/                # Utility functions
│   ├── models/             # Data models
├── .env                    # Environment variables
├── app.json                # Expo app config
```

---

## 🛡️ License

MIT

---

## 🙏 Credits

Built with love for the spiritual community 🔉
