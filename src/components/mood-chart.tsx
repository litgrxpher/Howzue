'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { JournalEntry } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import { Card } from './ui/card';

interface MoodChartProps {
  entries: JournalEntry[];
}

export function MoodChart({ entries }: MoodChartProps) {
  const data = entries.map(entry => {
    const moodInfo = MOODS.find(m => m.name === entry.mood);
    return {
      date: new Date(entry.date),
      mood: moodInfo?.value || 0,
    };
  }).sort((a,b) => a.date.getTime() - b.date.getTime());

  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(item.date, 'MMM d'),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const mood = MOODS.find(m => m.value === moodValue);
      return (
        <Card className="p-2">
            <p className="text-sm font-bold">{label}</p>
            <p className="text-sm">Mood: {mood?.emoji} {mood?.name}</p>
        </Card>
      );
    }
  
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0.5, 5.5]} 
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => MOODS.find(m => m.value === value)?.emoji || ''}
            stroke="hsl(var(--muted-foreground))"
            fontSize={16}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ r: 4, fill: 'hsl(var(--primary))' }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
