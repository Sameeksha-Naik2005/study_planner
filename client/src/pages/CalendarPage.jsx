import { useEffect, useRef, useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import StudyCalendar from '../components/calendar/StudyCalendar.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { requestNotificationPermission, scheduleStudyReminders, sendStudyReminder } from '../utils/notifications.js';

export default function CalendarPage() {
  const { tasks, subjects, updateItem } = useStudy();
  const [reminderStatus, setReminderStatus] = useState('');
  const reminderCancelRef = useRef(null);

  useEffect(() => () => {
    reminderCancelRef.current?.();
  }, []);

  const enableReminders = async () => {
    const permission = await requestNotificationPermission();

    if (permission !== 'granted') {
      setReminderStatus(permission === 'denied' ? 'Notifications are blocked in your browser settings.' : 'Notification permission was not enabled.');
      return;
    }

    reminderCancelRef.current?.();
    const schedule = scheduleStudyReminders(tasks);
    reminderCancelRef.current = schedule.cancel;

    const nextTask = tasks.find((task) => task.status !== 'done');
    if (nextTask) sendStudyReminder(nextTask);

    setReminderStatus(
      schedule.count
        ? `${schedule.count} reminder${schedule.count === 1 ? '' : 's'} scheduled for the next 24 hours while this app stays open.`
        : 'Reminders are enabled. No upcoming scheduled tasks were found in the next 24 hours.'
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Calendar"
        title="Plan by week or month"
        description="Drag scheduled blocks to adapt your week around real student life."
        action={<button className="btn-primary" onClick={enableReminders}>Enable reminders</button>}
      />
      {reminderStatus && <p className="mb-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{reminderStatus}</p>}
      <StudyCalendar tasks={tasks} subjects={subjects} onTaskMove={(id, date) => updateItem('tasks', id, { date })} />
    </>
  );
}
