# OSHUN: Digital Focus and Attention Regulator

SY BCA Mini Project (AY 2025-2026), MIT-WPU, Pune.
By **Tanisha Kaur Nagi** and **Bhoomi Soni**.

OSHUN is an offline-first Android app that helps users stay focused and build healthy phone habits. Users start a timed focus session, and the app notices when they leave it. Completed sessions earn rewards in a virtual ocean ecosystem (corals, fish and marine life).

## Features
- **Focus sessions:** timer with pause, resume and end, in modes like Study, Reading, Exercise, Meditation and Custom
- **Interruption detection:** records when the user leaves the app during a session and applies a penalty to the score
- **Ocean rewards:** better focus unlocks bigger corals and more marine life
- **Statistics and analytics:** weekly focus chart, completion rate and streaks
- **Daily goals, achievements and reminders**
- **Login and signup** with a local database
- **Settings:** notifications, sounds and blocked-apps list

## Tech stack
| Part | Technology |
|---|---|
| App framework | React Native, Expo SDK 54 |
| Language | JavaScript, TypeScript (navigation files) |
| Navigation | Expo Router |
| Database | SQLite (expo-sqlite), AsyncStorage |
| UI | expo-linear-gradient, react-native-animatable, gifted-charts |
| Other | date-fns, expo-notifications |

## How to run
1. Install Node.js
2. In this folder, run `npm install`
3. Run `npx expo start`
4. Open the app in **Expo Go** on an Android phone (the Expo Go version must match SDK 54)

## Limitations
- Data is stored only on the device (no cloud sync)
- Full operating-system-level app blocking is not implemented (Expo Go limitation); the app detects interruptions only
- Passwords are stored locally without encryption
- Prototype-level testing only (15 manual test cases)

## Project report
The full mini project report covers the analysis, design diagrams, database tables and test cases.