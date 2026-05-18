import PageHeader from '../components/common/PageHeader.jsx';
import SubjectList from '../components/dashboard/SubjectList.jsx';
import ScheduleGenerator from '../components/planner/ScheduleGenerator.jsx';
import SubjectForm from '../components/planner/SubjectForm.jsx';
import TaskBoard from '../components/planner/TaskBoard.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { generateStudyPlan, findWeakSubjects } from '../utils/scheduler.js';
import { getSubjectProgress } from '../utils/progress.js';

export default function Planner() {
  const { subjects, tasks, sessions, addItem, updateItem, removeItem, replaceCollection } = useStudy();
  const weakSubjects = findWeakSubjects(subjects, tasks);

  const handleGenerate = async ({ dailyHours, days }) => {
    const generated = generateStudyPlan({ subjects, tasks, days, dailyHours });
    const generatedTaskIds = tasks
      .filter((task) => task.type === 'study' || task.rescheduled)
      .map((task) => task.id);
    const manualTasks = tasks.filter((task) => task.type !== 'study' && !task.rescheduled);

    await Promise.all(generatedTaskIds.map((id) => removeItem('tasks', id)));
    await replaceCollection('tasks', [...manualTasks, ...generated]);
  };

  const handleDeleteSubject = async (subjectId) => {
    const linkedTasks = tasks.filter((task) => task.subjectId === subjectId);
    const linkedSessions = sessions.filter((session) => session.subjectId === subjectId);

    await Promise.all([
      removeItem('subjects', subjectId),
      ...linkedTasks.map((task) => removeItem('tasks', task.id)),
      ...linkedSessions.map((session) => removeItem('sessions', session.id))
    ]);
  };

  return (
    <>
      <PageHeader
        eyebrow="Planner"
        title="Rule-based AI timetable"
        description="Uses exam urgency, difficulty, weakness, and incomplete work to build balanced study blocks."
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <ScheduleGenerator onGenerate={handleGenerate} />
          <SubjectForm onAdd={(subject) => addItem('subjects', subject)} />
          <SubjectList subjects={subjects} tasks={tasks} onDelete={handleDeleteSubject} />
          <div className="panel">
            <h3 className="text-lg font-black">Top weak subjects</h3>
            <div className="mt-4 space-y-3">
              {weakSubjects.map((subject) => (
                <div key={subject.id} className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                  <p className="font-bold">{subject.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Weakness {subject.weakness}/10 | Progress {getSubjectProgress(subject, tasks)}%</p>
                </div>
              ))}
              {!weakSubjects.length && (
                <p className="text-sm text-slate-500 dark:text-slate-400">Add subjects to see weak areas.</p>
              )}
            </div>
          </div>
        </div>
        <TaskBoard tasks={tasks} subjects={subjects} onStatusChange={(id, status) => updateItem('tasks', id, { status })} />
      </div>
    </>
  );
}
