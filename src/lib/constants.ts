import type { Mood } from './types';

export const MOODS: { name: Mood; emoji: string; value: number }[] = [
  { name: 'great', emoji: '😊', value: 5 },
  { name: 'good', emoji: '🙂', value: 4 },
  { name: 'okay', emoji: '😐', value: 3 },
  { name: 'bad', emoji: '☹️', value: 2 },
  { name: 'awful', emoji: '😠', value: 1 },
];
