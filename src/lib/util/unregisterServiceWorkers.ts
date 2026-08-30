/**
 * Evict any previously registered service worker.
 *
 * This app no longer ships a service worker: offline precaching bought little
 * and its stale-while-revalidate cache stranded users on old asset bundles
 * after every deploy. On load we unregister any surviving registration and
 * drop its caches directly from the page so stale clients self-heal
 */
const unregisterServiceWorkers = async () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    );

    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch (error) {
    console.error("SW cleanup failed:", error);
  }
};

export default unregisterServiceWorkers;
