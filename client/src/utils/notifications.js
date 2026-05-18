export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

export function sendStudyReminder(task) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification('Study reminder', {
    body: `${task.title} starts at ${task.start}`,
    tag: task.id
  });
}

export function scheduleStudyReminders(tasks) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const timers = tasks
    .filter((task) => task.status !== 'done' && task.date && task.start)
    .map((task) => {
      const startsAt = new Date(`${task.date}T${task.start}`).getTime();
      const delay = startsAt - now;

      if (delay < 0 || delay > oneDay) return null;
      return window.setTimeout(() => sendStudyReminder(task), delay);
    })
    .filter(Boolean);

  return {
    count: timers.length,
    cancel: () => timers.forEach((timer) => window.clearTimeout(timer))
  };
}
