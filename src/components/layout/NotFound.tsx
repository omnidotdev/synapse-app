import { NotFoundPage } from "@omnidotdev/thornberry/not-found";

import app from "@/lib/config/app.config";

/**
 * 404 not found. Renders the shared Omni `<NotFoundPage>` (in-shell,
 * theme-aware, prominent "404"), branded with Synapse's wordmark; the header
 * brands by wordmark only. Home points at the app root.
 */
const NotFound = () => <NotFoundPage appName={app.name} />;

export default NotFound;
