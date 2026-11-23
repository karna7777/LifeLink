# LifeLink

A mobile app (React Native + Expo) that helps people find **blood and essential medicines quickly during emergencies**.

Patients search nearby hospitals, blood banks, and pharmacies, send requests, and chat with the facility. Facility staff keep stock updated, approve or reject requests, get warned about expiring items, and send urgent alerts to nearby donors. Admins verify that facilities are real before they appear in search.

> College major project for a Mobile Application Development course (React Native). The code favours **clarity over cleverness** so every part can be explained in a viva.

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
├── app/      # Expo React Native mobile app
├── server/   # Express + MongoDB + Socket.io backend
└── README.md
```

---

## Getting started

### 1. Server

```bash
cd server
npm install
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

The API runs on `http://localhost:5000`. Check it with `http://localhost:5000/api/health`.

### 2. Mobile app

```bash
cd app
npm install
npx expo start
```

In `app/src/config.js`, set the API base URL to your computer's local IP (e.g. `http://192.168.1.5:5000`) so a phone running Expo Go can reach the server.

---

## Build phases

This project is built in phases, one git commit per phase:

| # | Phase | Status |
|---|-------|--------|
| 0 | Project setup | ✅ |
| 1 | Navigation + screens | ⬜ |
| 2 | Auth + roles + donor profile | ⬜ |
| 3 | Facilities + admin verification | ⬜ |
| 4 | Inventory + expiry tracking | ⬜ |
| 5 | Nearby availability search | ⬜ |
| 6 | Request approval workflow | ⬜ |
| 7 | Real-time updates + chat | ⬜ |
| 8 | Push notifications + urgent broadcast | ⬜ |
| 9 | Offline support + connection recovery | ⬜ |
| 10 | Polish + release build | ⬜ |
