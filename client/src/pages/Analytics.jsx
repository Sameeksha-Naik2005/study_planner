import PageHeader from '../components/common/PageHeader.jsx';
import MetricCard from '../components/common/MetricCard.jsx';
import { SubjectBarChart, SubjectDoughnut, WeeklyLineChart } from '../components/analytics/Charts.jsx';
import Heatmap from '../components/analytics/Heatmap.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { formatFocusDuration, getProductivityScore, getStreak } from '../utils/analytics.js';

export default function Analytics() {
  const { subjects, tasks, sessions } = useStudy();
  const completed = tasks.filter((task) => task.status === 'done').length;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.minutes, 0);

  return (
    <>
      <PageHeader eyebrow="Analytics" title="Performance intelligence" description="Understand where your time goes, which subjects need support, and how consistent your week is." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Completed tasks" value={completed} detail={`${tasks.length} total tasks`} />
        <MetricCard label="Total focus" value={formatFocusDuration(totalMinutes)} detail="All logged sessions" accent="bg-mint" />
        <MetricCard label="Study rhythm" value={`${getStreak(sessions)}d`} detail={`${getProductivityScore(tasks, sessions, subjects)}% productivity`} accent="bg-coral" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <WeeklyLineChart sessions={sessions} />
        <SubjectDoughnut subjects={subjects} tasks={tasks} />
        <SubjectBarChart subjects={subjects} tasks={tasks} />
        <Heatmap sessions={sessions} />
      </div>
    </>
  );
}
