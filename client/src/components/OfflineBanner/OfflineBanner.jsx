import { memo } from "react";
import useOnlineStatus from "../../hooks/useOnlineStatus";

function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-2.5 px-4 shadow-lg animate-pulse">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <span className="text-lg">📡</span>
        <span>You're offline — Showing cached data. Some features may be limited.</span>
      </div>
    </div>
  );
}

export default memo(OfflineBanner);
