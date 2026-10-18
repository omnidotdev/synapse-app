import {
  Outlet,
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";

import { WorkspaceProvider } from "@/lib/context/workspace.context";
import { EventsProvider } from "@/providers/EventsProvider";
import { signOutLocal } from "@/server/functions/auth";

import type { Workspace } from "@/lib/context/workspace.context";

// Noop provider for client-side (main @omnidotdev/providers entry requires Node.js)
const eventsProvider = {
  async emit() {
    return {
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
  },
};

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context: { auth } }) => {
    if (!auth) throw redirect({ to: "/pricing", search: { signin: true } });

    // Clear zombie sessions where OAuth cookie exists but user is not
    // provisioned (identityProviderId missing from token enrichment)
    if (!auth.user?.identityProviderId) {
      await signOutLocal();
      throw redirect({ to: "/pricing", search: { signin: true } });
    }
  },
  component: AuthLayout,
});

/**
 * Auth layout.
 */
function AuthLayout() {
  const { organizations } = useRouteContext({ strict: false }) as {
    organizations?: Workspace[];
  };

  return (
    <WorkspaceProvider workspaces={organizations ?? []}>
      <EventsProvider provider={eventsProvider}>
        <Outlet />
      </EventsProvider>
    </WorkspaceProvider>
  );
}
