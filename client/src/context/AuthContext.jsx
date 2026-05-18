import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/firebaseConfig.js';

const AuthContext = createContext(null);

const demoUser = {
  uid: 'demo-user',
  displayName: 'Demo Student',
  email: 'student@example.com'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!isFirebaseConfigured && localStorage.getItem('demo-auth') === 'true') return demoUser;
    return null;
  });
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const register = async ({ name, email, password }) => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('demo-auth', 'true');
      setUser({ ...demoUser, displayName: name || demoUser.displayName, email });
      return;
    }

    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credentials.user, { displayName: name });
  };

  const login = async ({ email, password }) => {
    if (!isFirebaseConfigured) {
      localStorage.setItem('demo-auth', 'true');
      setUser({ ...demoUser, email });
      return;
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!isFirebaseConfigured) {
      localStorage.removeItem('demo-auth');
      setUser(null);
      return;
    }

    await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isDemoMode: !isFirebaseConfigured }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
