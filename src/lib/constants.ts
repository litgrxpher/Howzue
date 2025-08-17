import type { Mood } from './types';

export const MOODS: { name: Mood; emoji: string; value: number }[] = [
  { name: 'great', emoji: 'https://twemoji.maxcdn.com/v/14.0.2/svg/1f604.svg', value: 5 },
  { name: 'good', emoji: 'https://twemoji.maxcdn.com/v/14.0.2/svg/1f60a.svg', value: 4 },
  { name: 'okay', emoji: 'https://twemoji.maxcdn.com/v/14.0.2/svg/1f610.svg', value: 3 },
  { name: 'bad', emoji: 'https://twemoji.maxcdn.com/v/14.0.2/svg/1f61f.svg', value: 2 },
  { name: 'awful', emoji: 'https://twemoji.maxcdn.com/v/14.0.2/svg/1f61e.svg', value: 1 },
];
