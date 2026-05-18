# Smart AI Study Planner Website

A complete free-tier study planning SaaS built with React, Vite, Tailwind CSS, Firebase Authentication, Firestore, FullCalendar, Chart.js, Framer Motion, and dnd-kit. It does not use MongoDB, OpenAI, paid AI APIs, or paid libraries.

## Features

- Firebase email/password authentication with protected app routes
- Rule-based AI timetable generator using priority scoring
- Adaptive rescheduling for incomplete overdue tasks
- Subject management with exam dates, difficulty, weakness, progress, and weekly goals
- Dashboard with daily summary, productivity score, streaks, badges, and Pomodoro timer
- Drag-and-drop task board
- FullCalendar weekly/monthly planning with draggable events
- Analytics with line, doughnut, bar charts, and study heatmap
- Browser notification reminders
- Dark/light mode and responsive glassmorphism UI
- Local demo mode when Firebase environment variables are not configured

## Rule-Based AI Logic

The planner uses this weighted formula:

```txt
priority_score =
(exam_urgency * 0.4) +
(subject_difficulty * 0.3) +
(weakness_score * 0.2) +
(incompletion_rate * 0.1)
```

The generator then:

- prioritizes nearest exams
- allocates more time to difficult and weak subjects
- brings incomplete overdue work back into the plan
- caps study blocks to avoid overload
- spreads tasks across morning, evening, and night windows

Core logic lives in `client/src/utils/scheduler.js`.

## Firestore Structure

```txt
users/{userId}
  subjects/{subjectId}
    name, examDate, difficulty, weakness, progress, weeklyGoal, color
  tasks/{taskId}
    title, subjectId, date, start, end, duration, status, priority
  sessions/{sessionId}
    subjectId, date, minutes
  badges/{badgeId}
    label, earnedAt
```

## Setup

```bash
cd client
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. Without Firebase env vars, the app runs in local demo mode and persists sample data to `localStorage`.

## Firebase Setup

1. Create a free Firebase project at <https://console.firebase.google.com/>.
2. Enable Authentication, then enable Email/Password sign-in.
3. Create a Firestore database in production or test mode.
4. Copy `.env.example` to `.env`.
5. Fill in the Firebase web app values:

```txt
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Suggested Firestore Rules

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Free Deployment

### Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the root directory to `client`.
4. Add the Firebase environment variables in Vercel.
5. Deploy with the default Vite build command: `npm run build`.

### Firebase Hosting

```bash
cd client
npm run build
firebase login
firebase init hosting
firebase deploy
```

Use `dist` as the public directory and enable SPA rewrites to `index.html`.

## Project Structure

```txt
client/
  src/
    assets/
    components/
      analytics/
      auth/
      calendar/
      common/
      dashboard/
      planner/
      timer/
    context/
    firebase/
    hooks/
    pages/
    routes/
    services/
    styles/
    utils/
```

## Production Notes

- Keep Firebase keys in environment variables.
- Browser reminders require user permission and only fire while the app is open.
- The AI behavior is intentionally free and deterministic, using transparent scheduling algorithms rather than paid model APIs.
- For final-year project demos, keep demo mode available and connect Firebase for real authentication and persistence.


Active Link:- https://studyplanner-bay.vercel.app/app/settings
