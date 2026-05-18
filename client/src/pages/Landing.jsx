import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="min-h-screen px-4 py-6 text-slate-900 dark:text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">StudyOS</p>
          <h1 className="text-xl font-black">Smart AI Study Planner</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link className="btn-secondary" to="/login">Login</Link>
        </div>
      </nav>

      <main className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Free, private, rule-based AI</p>
          <h2 className="mt-4 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">Smart AI Study Planner</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Plan exams, balance weak subjects, track focus sessions, and auto-generate timetables without paid AI APIs or MongoDB.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">Start free</Link>
            <Link className="btn-secondary" to="/login">Open demo</Link>
          </div>
        </motion.section>

        <motion.section className="panel" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Priority engine', 'Weighted scheduling for urgency, difficulty, weakness, and incomplete work.'],
              ['Calendar control', 'Drag study blocks, exam deadlines, and reminders into a clean weekly flow.'],
              ['Progress analytics', 'Charts, heatmaps, streaks, badges, and productivity scoring.'],
              ['Pomodoro focus', 'Session logging with focus and break rhythm built in.']
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
