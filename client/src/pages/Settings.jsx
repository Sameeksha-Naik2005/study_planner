import { useState } from 'react';
import PageHeader from '../components/common/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useStudy } from '../context/StudyContext.jsx';
import { requestNotificationPermission, sendStudyReminder } from '../utils/notifications.js';

export default function Settings() {
  const { user, isDemoMode } = useAuth();
  const { subjects, tasks, sessions } = useStudy();
  const [notificationStatus, setNotificationStatus] = useState('');

  const handleNotificationPermission = async () => {
    const permission = await requestNotificationPermission();

    if (permission === 'granted') {
      setNotificationStatus('Browser reminders are enabled.');
      sendStudyReminder({ id: 'notification-test', title: 'Test reminder', start: 'now' });
      return;
    }

    if (permission === 'denied') {
      setNotificationStatus('Notifications are blocked in your browser settings.');
      return;
    }

    if (permission === 'unsupported') {
      setNotificationStatus('This browser does not support notifications.');
      return;
    }

    setNotificationStatus('Notification permission was not enabled.');
  };

  return (
    <>
      <PageHeader eyebrow="Profile" title="Settings and data" description="Manage account details, notification access, and deployment readiness." />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <h3 className="text-lg font-black">Account</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p><span className="font-bold">Name:</span> {user?.displayName || 'Student'}</p>
            <p><span className="font-bold">Email:</span> {user?.email}</p>
            <p><span className="font-bold">Mode:</span> {isDemoMode ? 'Local demo' : 'Firebase connected'}</p>
          </div>
        </section>
        <section className="panel">
          <h3 className="text-lg font-black">Workspace stats</h3>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">{subjects.length}</p><p className="text-xs text-slate-500">Subjects</p></div>
            <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">{tasks.length}</p><p className="text-xs text-slate-500">Tasks</p></div>
            <div className="rounded-xl bg-white/70 p-4 dark:bg-white/5"><p className="text-2xl font-black">{sessions.length}</p><p className="text-xs text-slate-500">Sessions</p></div>
          </div>
          <button className="btn-primary mt-5" onClick={handleNotificationPermission}>Allow browser reminders</button>
          {notificationStatus && <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">{notificationStatus}</p>}
        </section>
      </div>
    </>
  );
}
