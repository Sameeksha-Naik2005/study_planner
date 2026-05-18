import { Link } from 'react-router-dom';

export default function AuthForm({ mode, onSubmit, error, loading }) {
  const isRegister = mode === 'register';

  return (
    <form className="panel mx-auto w-full max-w-md space-y-4" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Smart AI Study Planner</p>
        <h1 className="mt-2 text-3xl font-black">{isRegister ? 'Create your workspace' : 'Welcome back'}</h1>
      </div>
      {isRegister && <input className="input" name="name" placeholder="Full name" required />}
      <input className="input" name="email" type="email" placeholder="Email address" required />
      <input className="input" name="password" type="password" placeholder="Password" minLength={6} required />
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
      </button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {isRegister ? 'Already have an account?' : 'New here?'}{' '}
        <Link className="font-bold text-brand-600" to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Login' : 'Create account'}
        </Link>
      </p>
    </form>
  );
}
