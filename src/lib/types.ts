export type Mood = 'great' | 'good' | 'okay' | 'bad' | 'awful';
export type Theme = 'light' | 'dark' | 'system';

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  mood: Mood;
  text: string;
}

export interface Settings {
  enableAiInsights: boolean;
  theme: Theme;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
