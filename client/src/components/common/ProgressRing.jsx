export default function ProgressRing({ value, label }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`${label} ${value}%`}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-brand-600 transition-all"
        />
      </svg>
      <div>
        <p className="text-3xl font-black">{value}%</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
