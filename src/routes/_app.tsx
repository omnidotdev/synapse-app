import {
  Outlet,
  createFileRoute,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";

import { OrganizationProvider } from "@/lib/context/organization.context";
import { EventsProvider } from "@/providers/EventsProvider";
import { signOutLocal } from "@/server/functions/auth";

import type { Organization } from "@/lib/context/organization.context";

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
    organizations?: Organization[];
  };

  return (
    <OrganizationProvider organizations={organizations ?? []}>
      <EventsProvider provider={eventsProvider}>
        <Outlet />
      </EventsProvider>
    </OrganizationProvider>
  );
}
