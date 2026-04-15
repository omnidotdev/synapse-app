/**
 * Register the service worker in production.
 * No-ops silently when `navigator.serviceWorker` is unavailable (e.g. SSR, insecure context)
 * or when the service worker script is not deployed.
 */
const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return;

  try {
    // Preflight check to avoid a browser-level 404 console error
    // when sw.js is not present in the deployment
    const res = await fetch("/sw.js", { method: "HEAD" });
    if (!res.ok) return;

    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      type: "classic",
    });
  } catch {
    // Silently ignore
  }
};

export default registerServiceWorker;
