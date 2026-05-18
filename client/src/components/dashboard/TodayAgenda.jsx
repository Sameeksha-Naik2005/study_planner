import { formatShortDate } from '../../utils/date.js';

export default function TodayAgenda({ tasks, subjects, onComplete }) {
  const bySubject = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));

  return (
    <div className="panel">
      <h3 className="text-lg font-black">Today&apos;s agenda</h3>
      <div className="mt-4 space-y-3">
        {tasks.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No tasks today. Generate a plan to fill your focus blocks.</p>}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div>
              <p className="font-bold">{task.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bySubject[task.subjectId]?.name || 'Study'} | {formatShortDate(task.date)} | {task.start || 'Flexible'}
              </p>
            </div>
            <button className={task.status === 'done' ? 'btn-secondary' : 'btn-primary'} onClick={() => onComplete(task)}>
              {task.status === 'done' ? 'Done' : 'Finish'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
