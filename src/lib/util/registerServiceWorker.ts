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
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
};

export default registerServiceWorker;
