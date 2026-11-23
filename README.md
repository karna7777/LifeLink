# LifeLink

A mobile app (**React Native + Expo**) that helps people find **blood and essential medicines quickly during emergencies**.

Patients search nearby hospitals, blood banks, and pharmacies, send requests, and chat with the facility in real time. Facility staff keep stock updated, approve or reject requests, get warned about expiring items, and send urgent alerts to nearby donors. Admins verify that facilities are real before they appear in search.

> College major project for a Mobile Application Development course (React Native). The code favours **clarity over cleverness** so every part can be explained in a viva.

---

## Features

**User (patient / donor)**
- Register / login (JWT); set blood group, donor + availability toggles, and location
- Search nearby **verified** facilities by blood group or medicine (sorted by distance)
- Create a request (item, quantity, urgency, optional prescription photo) and track its status
- Live chat with the facility on each request; cancel a request while it is pending
- Receive push + in-app notifications (status changes, messages, urgent donor alerts)

**Staff (facility)**
- Create their facility; it stays hidden from search until an admin verifies it
- Manage inventory (blood + medicines) with green/orange/red expiry badges
- Dashboard with live counts: pending requests, low stock, expiring soon, expired
- Approve / reject / fulfil incoming requests, with chat
- Broadcast an urgent need to matching available donors nearby

**Admin**
- View every facility, verify / unverify them
- See platform stats (users, facilities, verified facilities, requests)

---

## Tech stack

**Mobile app (`/app`)** — React Native with Expo (JavaScript)
React Navigation · Axios · Socket.io client · AsyncStorage · NetInfo · expo-location · expo-image-picker · expo-notifications

**Server (`/server`)** — Node.js + Express
MongoDB Atlas + Mongoose · JWT + bcrypt · Socket.io · Multer · node-cron · expo-server-sdk

---

## Project structure

```
LifeLink/
├── app/       # Expo React Native mobile app
│   └── src/
│       ├── config.js        # server base URL
│       ├── navigation/      # role-based navigators
│       ├── screens/         # auth / user / staff / admin / shared
│       ├── components/      # reusable UI (Button, Card, badges, …)
│       ├── context/         # AuthContext, SocketContext, NetworkContext
│       ├── services/        # api, socket, storage, location, notifications, offlineQueue
│       └── utils/           # constants, expiry
└── server/    # Express + MongoDB + Socket.io backend
    ├── models/ controllers/ routes/ middleware/
    ├── socket/              # Socket.io setup (rooms + chat)
    ├── jobs/expiryCheck.js  # daily cron
    ├── utils/               # distance, push, notify
    └── seed.js              # sample data
```

---

## Getting started

You need **two terminals**: one for the server, one for the app. Your phone and computer must be on the **same Wi-Fi**.

### 1. Server

```bash
cd server
npm install
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

Runs on `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### 2. Sample data (optional but recommended for the demo)

```bash
cd server
npm run seed
```

This resets the database and inserts sample facilities, inventory, donors, and an admin. Demo logins:

| Role  | Email                   | Password  | Notes                          |
|-------|-------------------------|-----------|--------------------------------|
| Admin | `admin@lifelink.app`    | `admin123`|                                |
| Staff | `staff@lifelink.app`    | `staff123`| City Hospital (verified)       |
| Staff | `bloodbank@lifelink.app`| `staff123`| Red Cross (verified)           |
| Staff | `pharmacy@lifelink.app` | `staff123`| Apollo (unverified — verify it)|
| User  | `user@lifelink.app`     | `user123` | B+ donor                       |
| User  | `donor2@lifelink.app`   | `user123` | O- donor                       |

### 3. Mobile app

```bash
cd app
npm install
npx expo start
```

Open it with **Expo Go** (scan the QR on your phone) or press `i` / `a` for a simulator.

In `app/src/config.js`, set `API_URL` to your computer's LAN IP (e.g. `http://192.168.1.5:5000`) so the phone can reach the server. Find it with `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows).

---

## Build an installable Android APK (EAS)

The actual build runs on Expo's servers and needs a free Expo account.

```bash
npm install -g eas-cli
cd app
eas login
eas build:configure
eas build -p android --profile preview
```

`eas.json` is already set up with a `preview` profile that outputs an `.apk`. When the build finishes, EAS gives you a download link. (Running `eas build:configure` also adds an Expo project id, which enables real push notifications on the installed build.)

---

## How it works (pull vs push)

- **Pull:** screens fetch data from the REST API with Axios (`services/api.js` attaches the JWT automatically).
- **Push:** the server sends live events over **Socket.io** (status changes, chat messages, inventory updates) and **Expo push notifications** when the app is closed. Every event also saves an in-app `Notification`.
- **Offline:** list screens cache their last data in AsyncStorage and show it when offline; a banner appears; chat messages created offline are queued and sent on reconnect; the socket re-joins rooms and refetches when the connection returns or the app comes back to the foreground.

> **Note on push notifications:** the in-app notifications list works everywhere, but real push-to-device only fires on a physical device with a dev/EAS build (not in Expo Go on a simulator).

---

## Course topic mapping (for the viva)

| Lecture topic | Where it is in LifeLink |
|---|---|
| Mobile platforms, cross-platform rendering | One Expo codebase for Android + iOS |
| Screen architecture, screens | Role-based navigators, `screens/` folder per role |
| Screen communication | `route.params` (facilityId, requestId), stacks + tabs |
| List rendering | `FlatList` for search, inventory, requests, messages, notifications |
| UI / UX | Status + expiry badges, blood group picker, empty & loading states |
| Data storage, local persistence | AsyncStorage: token, user, cached lists, offline queue |
| Interfaces, network requests | Axios REST API with auth header interceptor |
| Pull and push models | REST fetching (pull) vs Socket.io + push notifications (push) |
| Message architecture | Chat messages + request status events using Socket.io rooms |
| Connection recovery | NetInfo, offline queue, socket reconnect, refetch |
| Permissions, device permissions | Location, camera / gallery, notifications |
| Media, media persistence | Prescription + chat images uploaded (Multer) and displayed |
| Application runtime | AppState foreground refetch, background push notifications |
| Application build | EAS build → APK |

---

## Build phases

Built in 10 phases, one commit per phase:

| # | Phase | Status |
|---|-------|--------|
| 0 | Project setup | ✅ |
| 1 | Navigation + screens | ✅ |
| 2 | Auth + roles + donor profile | ✅ |
| 3 | Facilities + admin verification | ✅ |
| 4 | Inventory + expiry tracking | ✅ |
| 5 | Nearby availability search | ✅ |
| 6 | Request approval workflow | ✅ |
| 7 | Real-time updates + chat | ✅ |
| 8 | Push notifications + urgent broadcast | ✅ |
| 9 | Offline support + connection recovery | ✅ |
| 10 | Polish + release build | ✅ |
