// Simple IndexedDB helper to store file blobs
const DB_NAME = 'fastprint-files-db';
const STORE_NAME = 'files';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function saveFileToIndexedDB(key, file) {
  if (typeof window === 'undefined') return null;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const payload = {
      key,
      blob: file,
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      size: file.size,
    };
    const req = store.put(payload);
    req.onsuccess = () => {
      resolve(key);
    };
    req.onerror = (e) => reject(e.target.error);
    tx.oncomplete = () => db.close();
  });
}

export async function getFileFromIndexedDB(key) {
  if (typeof window === 'undefined') return null;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = (e) => {
      const rec = e.target.result;
      if (!rec) return resolve(null);
      // recreate File from stored blob
      try {
        const file = new File([rec.blob], rec.name || 'file', { type: rec.type || '' });
        resolve(file);
      } catch (err) {
        // fallback: return the blob
        resolve(rec.blob);
      }
    };
    req.onerror = (e) => reject(e.target.error);
    tx.oncomplete = () => db.close();
  });
}

export async function deleteFileFromIndexedDB(key) {
  if (typeof window === 'undefined') return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e.target.error);
    tx.oncomplete = () => db.close();
  });
}

export default {
  saveFileToIndexedDB,
  getFileFromIndexedDB,
  deleteFileFromIndexedDB,
};
