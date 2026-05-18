import PageHeader from '../components/common/PageHeader.jsx';
import MetricCard from '../components/common/MetricCard.jsx';
import ProgressRing from '../components/common/ProgressRing.jsx';
import TodayAgenda from '../components/dashboard/TodayAgenda.jsx';
import SubjectList from '../components/dashboard/SubjectList.jsx';
import MotivationCard from '../components/dashboard/MotivationCard.jsx';
import PomodoroTimer from '../components/timer/PomodoroTimer.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { formatFocusDuration, getProductivityScore, getStreak, getTodaySummary } from '../utils/analytics.js';
import { toISODate } from '../utils/date.js';

export default function Dashboard() {
  const { subjects, tasks, sessions, badges, updateItem, addItem } = useStudy();
  const today = getTodaySummary(tasks, sessions);
  const productivity = getProductivityScore(tasks, sessions, subjects);
  const streak = getStreak(sessions);
  const todayTasks = tasks.filter((task) => task.date === toISODate());

  const handleComplete = (task) => updateItem('tasks', task.id, { status: 'done' });
  const handleSession = (session) => addItem('sessions', session);

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Your study command center" description="Track the day, finish the right work first, and keep your focus rhythm visible." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tasks today" value={`${today.completed}/${today.tasks}`} detail="Completed tasks" accent="bg-brand-600" />
        <MetricCard label="Focus time" value={formatFocusDuration(today.minutes)} detail="Logged today" accent="bg-mint" />
        <MetricCard label="Productivity" value={`${productivity}%`} detail="7-day score" accent="bg-coral" />
        <MetricCard label="Streak" value={`${streak}d`} detail="Consecutive study days" accent="bg-amber" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <TodayAgenda tasks={todayTasks} subjects={subjects} onComplete={handleComplete} />
          <SubjectList subjects={subjects} tasks={tasks} />
        </div>
        <div className="space-y-6">
          <div className="panel"><ProgressRing value={productivity} label="Productivity score" /></div>
          <PomodoroTimer subjects={subjects} onSessionComplete={handleSession} />
          <MotivationCard streak={streak} badges={badges} />
        </div>
      </div>
    </>
  );
}
