import { useState, useEffect, useCallback } from 'react';

const QUEUE_KEY = 'sk_offline_queue';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => { setIsOnline(true); flushQueue(); };
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const enqueue = useCallback((request) => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    queue.push({ ...request, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, []);

  const flushQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (!queue.length) return;
    const { default: api } = await import('../services/api');
    const failed = [];
    for (const req of queue) {
      try { await api({ method: req.method, url: req.url, data: req.data }); }
      catch { failed.push(req); }
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  }, []);

  return { isOnline, enqueue, flushQueue };
}
