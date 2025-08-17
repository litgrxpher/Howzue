
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import type { JournalEntry } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import { Card } from './ui/card';

interface DailyMoodChartProps {
  entries: JournalEntry[];
}

const YAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const mood = MOODS.find(m => m.value === payload.value);
  if (mood) {
    return (
      <g transform={`translate(${x - 12},${y + 4})`}>
        <text fontSize="1.5em">{mood.emoji}</text>
      </g>
    );
  }
  return null;
}

export function DailyMoodChart({ entries }: DailyMoodChartProps) {
  const data = entries.map(entry => {
    const moodInfo = MOODS.find(m => m.name === entry.mood);
    return {
      date: new Date(entry.date),
      mood: moodInfo?.value || 0,
    };
  }).sort((a,b) => a.date.getTime() - b.date.getTime());

  const formattedData = data.map(item => ({
    ...item,
    formattedTime: format(item.date, 'h:mm a'),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const moodValue = payload[0].value;
      const mood = MOODS.find(m => m.value === moodValue);
      return (
        <Card className="p-2 flex items-center gap-2">
            <p className="text-sm font-bold">{label}:</p>
            {mood && <span className="text-xl">{mood.emoji}</span>}
            <p className="text-sm">{mood?.name}</p>
        </Card>
      );
    }
  
    return null;
  };

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="formattedTime" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0.5, 5.5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={<YAxisTick />}
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            width={40}
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
