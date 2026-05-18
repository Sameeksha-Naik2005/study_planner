import { useState } from 'react';

export default function ScheduleGenerator({ onGenerate }) {
  const [dailyHours, setDailyHours] = useState(3);
  const [days, setDays] = useState(14);

  return (
    <div className="panel">
      <h3 className="text-lg font-black">Smart generator</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Balances urgency, difficulty, weakness, and incompletion to prevent overloaded days.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Daily hours<input className="input mt-1" type="number" min="1" max="10" value={dailyHours} onChange={(event) => setDailyHours(Number(event.target.value))} /></label>
        <label className="text-sm font-semibold">Plan days<input className="input mt-1" type="number" min="1" max="21" value={days} onChange={(event) => setDays(Number(event.target.value))} /></label>
      </div>
      <button className="btn-primary mt-5 w-full" onClick={() => onGenerate({ dailyHours, days })}>Generate timetable</button>
    </div>
  );
}
