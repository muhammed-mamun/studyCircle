# Shikho StudyCircle (v1 Prototype)

StudyCircle is a social / community feature designed for the Shikho app to improve student activation and retention. It helps students transition from passive registrants to active learners by matching them into small, hyper-focused study groups based on their class, goals, weaknesses, and preferred study times.

This repository contains the interactive v1 prototype built with Next.js.

## ✨ Key Features

1. **AI-Driven Onboarding & Matching**
   - An interactive AI Concierge interviews students to understand their profile (Class, Goals, Weak Subjects, Study Time, Language).
   - A deterministic Match Engine scores and ranks 14 pre-seeded Study Circles to recommend the best 3 fits for the user.

2. **Rich Circle Context**
   - **About:** Every circle has its own DNA — including specific study approaches, strict rules, milestones, a designated Captain, and weekly streaks.
   - **Feed:** A real-time activity feed where members can post that they've studied, ask for help ("stuck"), or invite others to join a live session.

3. **Persistent State**
   - User profiles, circle memberships, and feed actions are saved using `localStorage`. This allows the prototype to feel like a real app without needing a backend database for the initial concept testing.

4. **Shikho Design System**
   - Built mobile-first with a premium aesthetic.
   - Adheres to Shikho's brand guidelines using Magenta and Purple themes.
   - Uses the `Hind Siliguri` font for authentic Bengali typography.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository and navigate into the project directory:
   ```bash
   cd study-circle-app
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the development server with Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages (Dashboard, Onboarding, Recommendations, Circle Home).
- `components/`: Reusable React components (`AIConcierge`, `ShikhoNav`).
- `lib/`: Core logic and data.
  - `circleData.ts`: 14 rich, pre-seeded study circles.
  - `matchEngine.ts`: The weighted scoring logic for the AI recommendations.
  - `store.ts`: LocalStorage management for persistent sessions.
  - `types.ts`: TypeScript interfaces for the entire system.
- `app/globals.css`: The comprehensive design system and CSS variables.

## 💡 How to Test
1. **First Visit:** You will be greeted by the Shikho dashboard. After 1.2 seconds, the AI Concierge will slide up.
2. **Onboarding:** Answer the 5 questions (Class, Focus, Weakness, Time, Language).
3. **Recommendations:** The Match Engine will calculate scores and present your top 3 circles.
4. **Join a Circle:** Click a circle to join it.
5. **Interact:** Inside the circle, browse the "About" tab for context, and use the "Feed" tab to post updates and interact with dummy data.

## 🗺️ Roadmap (v2 / v3)
- Real-time WebSockets for live chat and feed updates.
- Real-time presence indicators (who is currently studying).
- Voice / Audio integration for "Live Study Rooms".
- Backend integration (Node.js/PostgreSQL) replacing LocalStorage.
