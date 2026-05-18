import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function StudyCalendar({ tasks, subjects, onTaskMove }) {
  const subjectMap = Object.fromEntries(subjects.map((subject) => [subject.id, subject]));
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: `${task.date}T${task.start || '09:00'}`,
    end: `${task.date}T${task.end || '10:00'}`,
    backgroundColor: subjectMap[task.subjectId]?.color || '#2563EB',
    borderColor: subjectMap[task.subjectId]?.color || '#2563EB'
  }));

  return (
    <div className="panel">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        firstDay={1}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
        events={events}
        editable
        droppable
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        scrollTime="07:00:00"
        eventDrop={(info) => onTaskMove(info.event.id, info.event.startStr.slice(0, 10))}
      />
    </div>
  );
}
