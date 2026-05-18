const quotes = [
  'Small, repeated focus blocks beat heroic last-minute sprints.',
  'A finished chapter is feedback, not a verdict.',
  'Protect today. The timetable gets easier when today is honest.',
  'Momentum is built in minutes, then measured in weeks.'
];

export default function MotivationCard({ streak, badges }) {
  const quote = quotes[new Date().getDay() % quotes.length];

  return (
    <div className="panel overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">Motivation</p>
      <h3 className="mt-2 text-2xl font-black">{streak} day study streak</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{quote}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {badges.map((badge) => (
          <span key={badge.id} className="rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber">
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
