import { useIdentitySync } from "@omnidotdev/providers/react";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";

import { followSignOut, followSwitch } from "@/lib/auth/followIdentity";
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
  const { auth, authBaseUrl } = Route.useRouteContext();

  // Stay signed in as the same account as Omni: follow a switch or sign-out
  // made in another app
  useIdentitySync({
    authBaseUrl,
    subject: auth?.user?.identityProviderId,
    onSignedOut: followSignOut,
    onSwitched: followSwitch,
  });

  return (
    <WorkspaceProvider workspaces={organizations ?? []}>
      <EventsProvider provider={eventsProvider}>
        <Outlet />
      </EventsProvider>
    </WorkspaceProvider>
  );
}
