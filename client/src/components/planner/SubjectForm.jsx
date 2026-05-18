import { useState } from 'react';

const colors = ['#2563EB', '#20C997', '#F9735B', '#F59E0B', '#7C3AED'];

export default function SubjectForm({ onAdd }) {
  const [color, setColor] = useState(colors[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onAdd({
      name: form.get('name'),
      examDate: form.get('examDate'),
      difficulty: Number(form.get('difficulty')),
      weakness: Number(form.get('weakness')),
      progress: Number(form.get('progress')),
      weeklyGoal: Number(form.get('weeklyGoal')),
      color
    });
    event.currentTarget.reset();
  };

  return (
    <form className="panel space-y-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-black">Add subject</h3>
      <input className="input" name="name" placeholder="Subject name" required />
      <input className="input" name="examDate" type="date" required />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold">Difficulty<input className="input mt-1" name="difficulty" type="number" min="1" max="10" defaultValue="6" /></label>
        <label className="text-sm font-semibold">Weakness<input className="input mt-1" name="weakness" type="number" min="1" max="10" defaultValue="5" /></label>
        <label className="text-sm font-semibold">Starting progress %<input className="input mt-1" name="progress" type="number" min="0" max="100" defaultValue="0" /></label>
        <label className="text-sm font-semibold">Weekly hours<input className="input mt-1" name="weeklyGoal" type="number" min="1" max="40" defaultValue="5" /></label>
      </div>
      <div className="flex gap-2">
        {colors.map((option) => (
          <button
            key={option}
            type="button"
            aria-label={`Select ${option}`}
            className={`h-8 w-8 rounded-full border-2 ${color === option ? 'border-slate-900 dark:border-white' : 'border-transparent'}`}
            style={{ backgroundColor: option }}
            onClick={() => setColor(option)}
          />
        ))}
      </div>
      <button className="btn-primary w-full">Save subject</button>
    </form>
  );
}
