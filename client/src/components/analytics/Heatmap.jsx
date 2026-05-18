import { addDays, toISODate } from '../../utils/date.js';

export default function Heatmap({ sessions }) {
  const today = toISODate();
  const days = Array.from({ length: 35 }, (_, index) => {
    const date = toISODate(addDays(new Date(), index - 34));
    const minutes = sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.minutes, 0);
    return { date, minutes };
  });

  return (
    <div className="panel">
      <h3 className="text-lg font-black">Study heatmap</h3>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const intensity = Math.min(1, day.minutes / 60);
          const backgroundColor = day.minutes
            ? `rgba(32, 201, 151, ${0.28 + intensity * 0.62})`
            : 'rgba(148, 163, 184, 0.12)';
          return (
            <div
              key={day.date}
              title={`${day.date}: ${day.minutes} min`}
              className={`aspect-square rounded-lg border ${day.date === today ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-slate-200 dark:border-white/10'}`}
              style={{ backgroundColor }}
            />
          );
        })}
      </div>
    </div>
  );
}
