import { addDays, toISODate } from './date.js';
import { getSubjectProgress } from './progress.js';

const DEFAULT_WINDOWS = [
  { label: 'Morning', start: '07:00', end: '10:00' },
  { label: 'Evening', start: '16:00', end: '19:00' },
  { label: 'Night', start: '20:00', end: '22:30' }
];

function normalize(value, min = 0, max = 10) {
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

function daysBetween(dateValue, targetValue) {
  const date = new Date(dateValue);
  const target = new Date(targetValue);
  return Math.ceil((target - date) / 86400000);
}

function examUrgency(examDate, date = toISODate()) {
  const remaining = Math.max(0, daysBetween(date, examDate));
  return Math.max(0, 1 - remaining / 60);
}

export function calculatePriorityScore(subject, tasks = [], date = toISODate()) {
  const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
  const incomplete = subjectTasks.filter((task) => task.status !== 'done').length;
  const progress = getSubjectProgress(subject, tasks);
  const incompletionRate = subjectTasks.length ? incomplete / subjectTasks.length : 1 - progress / 100;

  const score =
    examUrgency(subject.examDate, date) * 0.4 +
    normalize(subject.difficulty) * 0.3 +
    normalize(subject.weakness) * 0.2 +
    incompletionRate * 0.1;

  return Math.round(score * 100);
}

function addHours(time, hours) {
  return addMinutes(time, Math.round(hours * 60));
}

function addMinutes(time, minutesToAdd) {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutesToAdd;
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
}

function timeToMinutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function buildWeightedPriorityQueue(subjects) {
  return subjects.flatMap((subject) => {
    const weight = subject.priority >= 80 ? 3 : subject.priority >= 60 ? 2 : 1;
    return Array.from({ length: weight }, () => subject);
  });
}

export function generateStudyPlan({ subjects, tasks, days = 7, dailyHours = 3, windows = DEFAULT_WINDOWS, breakMinutes = 15 }) {
  const overdueIncomplete = tasks.filter((task) => task.status !== 'done' && new Date(task.date) < new Date(toISODate()));
  const plan = [];
  const maxBlock = 1.5;
  const minBlock = 1;
  let studyBlockCount = 0;

  for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
    const date = toISODate(addDays(new Date(), dayIndex));
    let remainingHours = dailyHours;
    const hasExamToday = subjects.some((subject) => subject.examDate === date);
    if (hasExamToday) continue;

    const dailyPriorityList = subjects
      .map((subject) => ({ ...subject, priority: calculatePriorityScore(subject, tasks, date) }))
      .sort((a, b) => b.priority - a.priority);
    const examTomorrowSubjects = dailyPriorityList.filter((subject) => daysBetween(date, subject.examDate) === 1);
    const subjectQueue = examTomorrowSubjects.length
      ? examTomorrowSubjects
      : buildWeightedPriorityQueue(dailyPriorityList);

    const adaptiveTasks = overdueIncomplete
      .filter((_, index) => index % days === dayIndex)
      .map((task) => ({ ...task, date, status: 'todo', rescheduled: true }));

    adaptiveTasks.forEach((task) => {
      if (remainingHours <= 0) return;
      plan.push({ ...task, id: crypto.randomUUID(), title: `Catch up: ${task.title}`, priority: task.priority + 5 });
      remainingHours -= Math.min(task.duration || 1, maxBlock);
    });

    for (const window of windows) {
      let nextStart = window.start;

      while (remainingHours >= minBlock && subjectQueue.length) {
        const availableMinutes = timeToMinutes(window.end) - timeToMinutes(nextStart);
        if (availableMinutes < minBlock * 60) break;

        const subject = subjectQueue[studyBlockCount % subjectQueue.length];
        const duration = Math.min(maxBlock, remainingHours, availableMinutes / 60);
        const end = addHours(nextStart, duration);

        plan.push({
          id: crypto.randomUUID(),
          title: `${subject.name} ${window.label.toLowerCase()} study`,
          subjectId: subject.id,
          date,
          start: nextStart,
          end,
          duration,
          status: 'todo',
          priority: subject.priority,
          type: 'study'
        });

        remainingHours -= duration;
        studyBlockCount += 1;
        nextStart = addMinutes(end, breakMinutes);
      }
    }
  }

  return plan;
}

export function findWeakSubjects(subjects, tasks = []) {
  return [...subjects]
    .sort((a, b) => b.weakness + (100 - getSubjectProgress(b, tasks)) / 10 - (a.weakness + (100 - getSubjectProgress(a, tasks)) / 10))
    .slice(0, 3);
}
