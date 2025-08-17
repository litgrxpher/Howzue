# Howzue - Your Personal Mood Companion

Howzue is a beautifully designed, private, and insightful mood tracking and journaling application. It helps you understand your emotional patterns, reflect on your thoughts, and gain a clearer perspective on your well-being. All your data is stored locally on your device, ensuring complete privacy.

## ✨ Core Features

-   **Daily Mood Logging**: Quickly log your mood throughout the day with a simple emoji-based selector.
-   **In-Depth Journaling**: Write detailed journal entries to explore your thoughts and feelings.
-   **Interactive Dashboard**: View your daily mood flow, journaling streak, and weekly mood average at a glance.
-   **Historical View**: Use the calendar to look back at your mood and entries for any given day.
-   **Visual Insights**: A beautiful line chart visualizes your mood trends over time, helping you spot patterns.
-   **AI-Powered Summaries**: Get AI-generated summaries of your recent mood patterns to identify potential triggers and trends (requires an internet connection).
-   **100% Private**: All your journal entries and mood data are stored exclusively in your browser's local storage. Nothing is sent to a server.
-   **Customizable Theme**: Switch between light, dark, and system themes to match your preference.

## 🛠️ Tech Stack

This project is built with a modern, performant, and developer-friendly tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
-   **Charts**: [Recharts](https://recharts.org/)
-   **State Management**: React Context with custom hooks


The application uses Firebase Genkit to power its AI features. The relevant flows are located in the `src/ai/flows` directory. These flows are responsible for:
-   Summarizing mood patterns.
-   Classifying journal entry intent.
-   Generating mood insights.

These features can be extended or modified to add more intelligent capabilities to the app.
