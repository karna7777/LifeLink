# LifeLink

LifeLink is a mobile app that helps people find **blood and essential medicines quickly during emergencies**.

During an emergency, finding a specific blood group or medicine means calling many hospitals one by one, while facilities lose track of their stock and let medicines expire. LifeLink brings everyone into one place: patients search nearby hospitals, blood banks and pharmacies for what they need, send a request and chat with the facility; facility staff keep their stock updated, approve requests and alert nearby donors; and admins verify that facilities are genuine before they appear in search.

Built with **React Native (Expo)** on the front end and a **Node.js + Express + MongoDB** back end.

---

## Features

**For patients / donors**
- Register and log in; set blood group, donor status and location
- Search nearby **verified** facilities by blood group or medicine, sorted by distance
- Send a request (item, quantity, urgency, optional prescription photo) and track its status
- Chat with the facility in real time; cancel a request while it is still pending
- Get notified about status changes, messages and urgent donor alerts

**For facility staff**
- Create a facility (it stays hidden from search until an admin verifies it)
- Manage inventory of blood and medicines, with colour-coded expiry warnings
- See a dashboard of pending requests, low stock, and expiring / expired items
- Approve, reject or fulfil incoming requests
- Broadcast an urgent need to matching available donors nearby

**For admins**
- Review all facilities and verify or reject them
- View overall platform statistics

---

## Tech stack

**App** — React Native with Expo (JavaScript), React Navigation, Axios, Socket.io client, AsyncStorage, NetInfo, expo-location, expo-image-picker, expo-notifications.

**Server** — Node.js + Express, MongoDB Atlas with Mongoose, JWT + bcrypt for auth, Socket.io for real-time, Multer for image uploads, node-cron for the daily expiry check.

---

## Project structure

```
LifeLink/
├── app/       # Expo React Native mobile app
│   └── src/
│       ├── navigation/   # role-based navigators
│       ├── screens/      # auth / user / staff / admin / shared
│       ├── components/   # reusable UI (buttons, cards, badges, …)
│       ├── context/      # auth, socket and network state
│       ├── services/     # api, socket, storage, location, notifications
│       └── utils/        # constants and helpers
└── server/    # Express + MongoDB + Socket.io back end
    ├── models/           # Mongoose schemas
    ├── controllers/      # request handlers
    ├── routes/           # API endpoints
    ├── middleware/       # auth, role checks, file upload
    ├── socket/           # real-time setup
    ├── jobs/             # daily expiry check
    └── seed.js           # sample data
```

---

## How it works

The app talks to the server in two ways:

- **Pull** — screens fetch data from the REST API with Axios, which automatically attaches the logged-in user's token to every request.
- **Push** — the server pushes live updates over Socket.io (request status, chat messages, inventory changes) and sends push notifications when the app is closed.

The app also keeps working on a weak connection: it caches the last data it loaded, shows an offline banner, queues messages sent while offline, and re-syncs automatically when the connection returns.

---

## Getting started

You need **two terminals** — one for the server and one for the app. Your phone and computer must be on the **same Wi-Fi**.

### 1. Server

```bash
cd server
npm install
cp .env.example .env     # then add your MONGO_URI and JWT_SECRET
npm run dev
```

The API runs on `http://localhost:5000`.

### 2. Sample data (optional)

```bash
cd server
npm run seed
```

This fills the database with sample facilities, inventory, donors and an admin so the app isn't empty. Sample logins:

| Role  | Email                   | Password  |
|-------|-------------------------|-----------|
| Admin | `admin@lifelink.app`    | `admin123`|
| Staff | `staff@lifelink.app`    | `staff123`|
| User  | `user@lifelink.app`     | `user123` |

### 3. App

```bash
cd app
npm install
npx expo start
```

Open it with **Expo Go** (scan the QR code) or in a simulator. In `app/src/config.js`, set `API_URL` to your computer's local IP (e.g. `http://192.168.1.5:5000`) so the phone can reach the server.

---

## Building an Android APK

```bash
npm install -g eas-cli
cd app
eas login
eas build -p android --profile preview
```

The build runs on Expo's servers and returns a download link for the installable `.apk`.
