# Howzue - Your Personal Mood Companion

Howzue is a beautifully designed, private, and insightful mood tracking and journaling application. It helps you understand your emotional patterns, reflect on your thoughts, and gain a clearer perspective on your well-being. All your data is stored locally on your device, ensuring complete privacy.

![Howzue Dashboard](https://placehold.co/800x400.png?text=Howzue+App+Screenshot)
*<p align="center">A placeholder image - you can replace this with a screenshot of your app!</p>*

---

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

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- Node.js (v18 or later recommended)
- npm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/howzue.git
    cd howzue
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result. You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🔒 Data Privacy

Howzue is designed to be a private sanctuary for your thoughts. All data, including your user profile and every journal entry, is stored in your browser's **local storage**. This means your data never leaves your computer.

The only exception is when you choose to use the AI-powered summary feature on the "Insights" page. This feature sends anonymized text from your recent entries to a secure cloud-based AI to generate insights.

## 🤖 Genkit AI Integration

The application uses Firebase Genkit to power its AI features. The relevant flows are located in the `src/ai/flows` directory. These flows are responsible for:
-   Summarizing mood patterns.
-   Classifying journal entry intent.
-   Generating mood insights.

These features can be extended or modified to add more intelligent capabilities to the app.
