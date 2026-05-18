import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const columns = [
  ['todo', 'To study'],
  ['in-progress', 'In focus'],
  ['done', 'Done']
];

function TaskCard({ task, subject }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const schedule = [task.date, task.start && task.end ? `${task.start}-${task.end}` : null].filter(Boolean).join(' | ');

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-2 h-1.5 w-10 rounded-full" style={{ backgroundColor: subject?.color || '#2563EB' }} />
      <p className="font-bold">{task.title}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subject?.name || 'Study'} | {task.duration || 1}h | priority {task.priority || 50}</p>
      {schedule && <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{schedule}</p>}
    </div>
  );
}

function TaskColumn({ status, label, tasks, subjectMap }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <SortableContext id={status} items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="panel min-h-80">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">{label}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{tasks.length}</span>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => <TaskCard key={task.id} task={task} subject={subjectMap[task.subjectId]} />)}
        </div>
      </div>
    </SortableContext>
  );
}

export default function TaskBoard({ tasks, subjects, onStatusChange }) {
  const subjectMap = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const overStatus = columns.find(([status]) => status === over.id)?.[0];
    const overTask = tasks.find((task) => task.id === over.id);
    const nextStatus = overStatus || overTask?.status;
    if (nextStatus) onStatusChange(active.id, nextStatus);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map(([status, label]) => (
          <TaskColumn key={status} status={status} label={label} tasks={tasks.filter((task) => task.status === status)} subjectMap={subjectMap} />
        ))}
      </div>
    </DndContext>
  );
}
