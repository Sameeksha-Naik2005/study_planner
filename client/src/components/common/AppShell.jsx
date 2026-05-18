import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const nav = [
  ['Dashboard', '/app/dashboard'],
  ['Planner', '/app/planner'],
  ['Calendar', '/app/calendar'],
  ['Analytics', '/app/analytics'],
  ['Settings', '/app/settings']
];

export default function AppShell() {
  const { user, logout, isDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <aside className="fixed inset-x-0 top-0 z-30 border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:inset-y-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-5 p-4">
          <div className="flex items-center justify-between lg:block">
            <NavLink to="/app/dashboard" className="block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">StudyOS</p>
              <h1 className="text-xl font-black">Smart Planner</h1>
            </NavLink>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {nav.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'text-slate-600 hover:bg-white/70 hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto hidden rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 lg:block">
            <p className="text-sm font-bold">{user?.displayName || 'Student'}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            {isDemoMode && <p className="mt-2 text-xs font-semibold text-coral">Demo mode: add Firebase env vars to go live.</p>}
            <div className="mt-4 flex items-center gap-2">
              <ThemeToggle />
              <button className="btn-secondary flex-1" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="px-4 pb-8 pt-36 lg:ml-72 lg:px-8 lg:pt-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
