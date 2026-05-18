import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import {
  createStudyItem,
  deleteStudyItem,
  listenToStudyData,
  updateStudyItem
} from '../services/firestoreService.js';
import { demoStudyData } from '../utils/demoData.js';

const StudyContext = createContext(null);
const demoStorageKey = 'demo-study-data-v2';

export function StudyProvider({ children }) {
  const { user, isDemoMode } = useAuth();
  const [data, setData] = useState(demoStudyData);
  const [loading, setLoading] = useState(false);
  const [demoDataLoaded, setDemoDataLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setData(demoStudyData);
      setDemoDataLoaded(false);
      return undefined;
    }

    if (isDemoMode) {
      const saved = localStorage.getItem(demoStorageKey);
      setData(saved ? JSON.parse(saved) : demoStudyData);
      setDemoDataLoaded(true);
      return undefined;
    }

    setDemoDataLoaded(false);
    setLoading(true);
    return listenToStudyData(user.uid, (freshData) => {
      setData(freshData);
      setLoading(false);
    });
  }, [user, isDemoMode]);

  useEffect(() => {
    if (user && isDemoMode && demoDataLoaded) {
      localStorage.setItem(demoStorageKey, JSON.stringify(data));
    }
  }, [data, user, isDemoMode, demoDataLoaded]);

  const addItem = async (collectionName, item) => {
    const payload = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    if (isDemoMode) {
      setData((current) => ({ ...current, [collectionName]: [...current[collectionName], payload] }));
      return payload;
    }
    return createStudyItem(user.uid, collectionName, payload);
  };

  const updateItem = async (collectionName, id, patch) => {
    if (isDemoMode) {
      setData((current) => ({
        ...current,
        [collectionName]: current[collectionName].map((item) =>
          item.id === id ? { ...item, ...patch } : item
        )
      }));
      return;
    }
    await updateStudyItem(user.uid, collectionName, id, patch);
  };

  const removeItem = async (collectionName, id) => {
    if (isDemoMode) {
      setData((current) => ({
        ...current,
        [collectionName]: current[collectionName].filter((item) => item.id !== id)
      }));
      return;
    }
    await deleteStudyItem(user.uid, collectionName, id);
  };

  const replaceCollection = async (collectionName, items) => {
    if (isDemoMode) {
      setData((current) => ({ ...current, [collectionName]: items }));
      return;
    }

    await Promise.all(
      items.map((item) => createStudyItem(user.uid, collectionName, item))
    );
  };

  const value = { ...data, loading, addItem, updateItem, removeItem, replaceCollection };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside StudyProvider');
  return context;
}
