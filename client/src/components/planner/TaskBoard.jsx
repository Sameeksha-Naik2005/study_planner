import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCorners,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const columns = [
  ['todo', 'To study'],
  ['in-progress', 'In focus'],
  ['done', 'Done']
];

function detectCollision(args) {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
}

function TaskCard({ task, subject, dragging = false }) {
  const schedule = [task.date, task.start && task.end ? `${task.start}-${task.end}` : null].filter(Boolean).join(' | ');

  return (
    <div className={`touch-none select-none rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-slate-900/80 ${dragging ? 'cursor-grabbing opacity-80 ring-2 ring-brand-500' : 'cursor-grab'}`}>
      <div className="mb-2 h-1.5 w-10 rounded-full" style={{ backgroundColor: subject?.color || '#2563EB' }} />
      <p className="font-bold">{task.title}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subject?.name || 'Study'} | {task.duration || 1}h | priority {task.priority || 50}</p>
      {schedule && <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{schedule}</p>}
    </div>
  );
}

function SortableTaskCard({ task, subject }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', status: task.status }
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} subject={subject} dragging={isDragging} />
    </div>
  );
}

function TaskColumn({ status, label, tasks, subjectMap }) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: 'column', status } });

  return (
    <SortableContext id={status} items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className={`panel min-h-80 transition ${isOver ? 'ring-2 ring-brand-500/60' : ''}`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-black">{label}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{tasks.length}</span>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => <SortableTaskCard key={task.id} task={task} subject={subjectMap[task.subjectId]} />)}
        </div>
      </div>
    </SortableContext>
  );
}

export default function TaskBoard({ tasks, subjects, onStatusChange }) {
  const [activeId, setActiveId] = useState(null);
  const subjectMap = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));
  const activeTask = tasks.find((task) => task.id === activeId);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const overStatus = over.data.current?.type === 'column' ? over.data.current.status : null;
    const overTask = tasks.find((task) => task.id === over.id);
    const nextStatus = overStatus || overTask?.status || over.data.current?.status;
    const activeTask = tasks.find((task) => task.id === active.id);
    if (nextStatus && activeTask?.status !== nextStatus) onStatusChange(active.id, nextStatus);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={detectCollision} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map(([status, label]) => (
          <TaskColumn key={status} status={status} label={label} tasks={tasks.filter((task) => task.status === status)} subjectMap={subjectMap} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} subject={subjectMap[activeTask.subjectId]} dragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
