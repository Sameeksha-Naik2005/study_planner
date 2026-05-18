import { addDays, toISODate } from './date.js';
import { getSubjectProgress } from './progress.js';
import { calculatePriorityScore } from './scheduler.js';

export function getTodaySummary(tasks, sessions) {
  const today = toISODate();
  const todayTasks = tasks.filter((task) => task.date === today);
  const completed = todayTasks.filter((task) => task.status === 'done').length;
  const minutes = sessions.filter((session) => session.date === today).reduce((sum, session) => sum + session.minutes, 0);
  return { tasks: todayTasks.length, completed, minutes };
}

export function formatFocusDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours}h`;
}

export function getProductivityScore(tasks, sessions, subjects) {
  const recentDates = Array.from({ length: 7 }, (_, index) => toISODate(addDays(new Date(), -index)));
  const recentTasks = tasks.filter((task) => recentDates.includes(task.date));
  const completedRate = recentTasks.length
    ? recentTasks.filter((task) => task.status === 'done').length / recentTasks.length
    : 0.35;
  const focusMinutes = sessions
    .filter((session) => recentDates.includes(session.date))
    .reduce((sum, session) => sum + session.minutes, 0);
  const goalMinutes = Math.max(1, subjects.reduce((sum, subject) => sum + subject.weeklyGoal * 60, 0));
  const consistency = recentDates.filter((date) => sessions.some((session) => session.date === date)).length / 7;

  return Math.round((completedRate * 0.45 + Math.min(1, focusMinutes / goalMinutes) * 0.35 + consistency * 0.2) * 100);
}

export function getStreak(sessions) {
  let streak = 0;
  for (let index = 0; index < 365; index += 1) {
    const date = toISODate(addDays(new Date(), -index));
    if (sessions.some((session) => session.date === date)) streak += 1;
    else if (index > 0) break;
  }
  return streak;
}

export function getWeeklySeries(sessions) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = toISODate(addDays(new Date(), index - 6));
    const minutes = sessions.filter((session) => session.date === date).reduce((sum, session) => sum + session.minutes, 0);
    return { date, hours: Number((minutes / 60).toFixed(1)) };
  });
}

export function getSubjectComparison(subjects, tasks) {
  return subjects.map((subject) => ({
    name: subject.name,
    progress: getSubjectProgress(subject, tasks),
    priority: calculatePriorityScore(subject, tasks),
    color: subject.color
  }));
}
