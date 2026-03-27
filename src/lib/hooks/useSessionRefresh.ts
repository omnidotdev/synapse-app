import { useEffect, useRef } from "react";

/**
 * Periodically call a refresh function to keep the session alive.
 *
 * Runs on a fixed interval and when the window regains focus after
 * being hidden for more than half the interval, so the access token
 * stays fresh even when the user idles.
 *
 * @param refreshFn - Async function that refreshes the session
 * @param intervalMs - Refresh interval in milliseconds (default: 4 min)
 */
function useSessionRefresh(
  refreshFn: () => Promise<unknown>,
  intervalMs = 4 * 60 * 1000,
) {
  const lastRefresh = useRef(Date.now());

  useEffect(() => {
    const refresh = () => {
      lastRefresh.current = Date.now();
      refreshFn();
    };

    const id = setInterval(refresh, intervalMs);

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastRefresh.current > intervalMs / 2) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refreshFn, intervalMs]);
}

export default useSessionRefresh;
