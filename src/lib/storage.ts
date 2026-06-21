import { DocumentChunk } from "@/types";

const DB_NAME = "MyDocReader";
const DB_VERSION = 1;
const STORE_NAME = "chunks";
const META_KEY = "session_meta";

interface SessionMeta {
  documentNames: string[];
  chunkCount: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveChunks(chunks: DocumentChunk[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const chunk of chunks) {
      store.put(chunk);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    db.close();
  });
}

export async function loadChunks(): Promise<DocumentChunk[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function clearChunks(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    db.close();
  });
}

export async function getChunkCount(): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export async function saveSessionMeta(meta: SessionMeta): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: META_KEY, ...meta });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    db.close();
  });
}

export async function loadSessionMeta(): Promise<SessionMeta | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(META_KEY);
    request.onsuccess = () => {
      const data = request.result;
      if (data && data.documentNames) {
        resolve({ documentNames: data.documentNames, chunkCount: data.chunkCount });
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}
