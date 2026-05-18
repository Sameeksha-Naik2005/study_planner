export function getSubjectProgress(subject, tasks = []) {
  const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
  if (!subjectTasks.length) return Number(subject.progress) || 0;

  const completed = subjectTasks.filter((task) => task.status === 'done').length;
  return Math.round((completed / subjectTasks.length) * 100);
}
