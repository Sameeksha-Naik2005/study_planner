import { useEffect, useMemo, useRef, useState } from 'react';
import { toISODate } from '../../utils/date.js';

const modes = {
  focus: 60 * 60,
  break: 5 * 60
};

export default function PomodoroTimer({ subjects, onSessionComplete }) {
  const [mode, setMode] = useState('focus');
  const [seconds, setSeconds] = useState(modes.focus);
  const [running, setRunning] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const completionHandledRef = useRef(false);

  useEffect(() => {
    setSubjectId((current) => current || subjects[0]?.id || '');
  }, [subjects]);

  useEffect(() => {
    if (!running) return undefined;
    const interval = setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running || seconds > 0 || completionHandledRef.current) return;

    completionHandledRef.current = true;
    setRunning(false);
    if (mode === 'focus') {
      onSessionComplete({ subjectId, date: toISODate(), minutes: Math.round(modes.focus / 60) });
    }
    const nextMode = mode === 'focus' ? 'break' : 'focus';
    setMode(nextMode);
    setSeconds(modes[nextMode]);
  }, [running, seconds, mode, onSessionComplete, subjectId]);

  const time = useMemo(() => {
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  }, [seconds]);

  const switchMode = (nextMode) => {
    completionHandledRef.current = false;
    setMode(nextMode);
    setSeconds(modes[nextMode]);
    setRunning(false);
  };

  const toggleTimer = () => {
    if (!running) completionHandledRef.current = false;
    setRunning((value) => !value);
  };

  return (
    <div className="panel">
      <h3 className="text-lg font-black">Pomodoro focus</h3>
      <div className="mt-4 flex rounded-xl bg-slate-100 p-1 dark:bg-white/10">
        {Object.keys(modes).map((item) => (
          <button key={item} className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold capitalize ${mode === item ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900' : 'text-slate-500'}`} onClick={() => switchMode(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="py-8 text-center">
        <p className="text-6xl font-black tabular-nums">{time}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Focus mode logs sessions automatically.</p>
      </div>
      <select className="input mb-3" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
        {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-primary" onClick={toggleTimer}>{running ? 'Pause' : 'Start'}</button>
        <button className="btn-secondary" onClick={() => switchMode(mode)}>Reset</button>
      </div>
    </div>
  );
}
