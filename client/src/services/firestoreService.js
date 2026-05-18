import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig.js';

const collections = ['subjects', 'tasks', 'sessions', 'badges'];

export function listenToStudyData(userId, callback) {
  const state = {
    subjects: [],
    tasks: [],
    sessions: [],
    badges: []
  };

  const unsubscribers = collections.map((name) =>
    onSnapshot(query(collection(db, 'users', userId, name)), (snapshot) => {
      state[name] = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      callback({ ...state });
    })
  );

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export async function createStudyItem(userId, collectionName, item) {
  const id = item.id || crypto.randomUUID();
  await setDoc(doc(db, 'users', userId, collectionName, id), { ...item, id });
  return { ...item, id };
}

export async function updateStudyItem(userId, collectionName, id, patch) {
  await updateDoc(doc(db, 'users', userId, collectionName, id), patch);
}

export async function deleteStudyItem(userId, collectionName, id) {
  await deleteDoc(doc(db, 'users', userId, collectionName, id));
}
