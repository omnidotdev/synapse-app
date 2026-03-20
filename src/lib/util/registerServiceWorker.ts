/**
 * Register the service worker in production.
 * No-ops silently when `navigator.serviceWorker` is unavailable (e.g. SSR, insecure context).
 */
const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      type: "classic",
    });
  } catch {
    // Silently ignore — sw.js may not be present in all deployment environments
  }
};

export default registerServiceWorker;
