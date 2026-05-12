import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOfflineSync } from '../hooks/useOfflineSync';

export default function OfflineBanner() {
  const { isOnline } = useOfflineSync();
  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-amber-500 text-amber-950 text-center py-2 text-xs font-bold z-[300] flex items-center justify-center gap-2">
      <WifiOff size={14}/> You are offline. Some features may be limited.
    </div>
  );
}
