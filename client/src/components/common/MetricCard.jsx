export default function MetricCard({ label, value, detail, accent = 'bg-brand-600' }) {
  return (
    <div className="panel">
      <div className={`mb-4 h-1.5 w-14 rounded-full ${accent}`} />
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p>}
    </div>
  );
}
