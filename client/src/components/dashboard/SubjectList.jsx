import { calculatePriorityScore } from '../../utils/scheduler.js';

export default function SubjectList({ subjects, tasks, onDelete }) {
  return (
    <div className="panel">
      <h3 className="text-lg font-black">Subject priorities</h3>
      <div className="mt-4 space-y-4">
        {!subjects.length && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No subjects saved yet.</p>
        )}
        {subjects.map((subject) => {
          const score = calculatePriorityScore(subject, tasks);
          return (
            <div key={subject.id}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold">{subject.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Priority {score}</span>
                  {onDelete && (
                    <button
                      className="rounded-lg border border-red-200 px-2 py-1 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-400/10"
                      type="button"
                      onClick={() => onDelete(subject.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full" style={{ width: `${score}%`, backgroundColor: subject.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
