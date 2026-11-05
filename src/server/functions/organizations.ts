import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AUTH_BASE_URL } from "@/lib/config/env.config";
import gatekeeperOrg from "@/lib/config/gatekeeper";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

// Workspace creation and handle-availability checks are funneled to the account
// hub (account.omni.dev/workspaces), the single ecosystem surface that owns
// them, so this app no longer exposes its own create/check server functions.
// Only the read and management paths below remain.

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org
 */
export const getOrganizationBySlug = createServerFn({ method: "POST" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      return null;
    }

    return gatekeeperOrg.getOrganizationBySlug(data.slug, accessToken);
  });

/**
 * Fetch an organization by slug without authentication.
 * Used for public board access when no JWT is available
 */
export const fetchOrganizationBySlug = createServerFn({ method: "POST" })
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await gatekeeperOrg.fetchOrganizationBySlug(data.slug);
    } catch (error) {
      console.error("Error fetching organization by slug:", error);
      return null;
    }
  });

const updateOrgSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
});

/**
 * Update organization details via Better Auth
 */
export const updateOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) => updateOrgSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const { accessToken } = context.session;

    const res = await fetch(`${AUTH_BASE_URL}/api/auth/organization/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Satisfy Better Auth CSRF check for server-to-server calls
        Origin: AUTH_BASE_URL ?? "",
      },
      body: JSON.stringify({
        organizationId: data.organizationId,
        data: {
          ...(data.name && { name: data.name }),
          ...(data.slug && { slug: data.slug }),
        },
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Update failed: ${res.status}`);
    }

    return true;
  });

/**
 * Delete an organization via Better Auth
 */
export const deleteOrganization = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((data) =>
    z.object({ organizationId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<boolean> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const { accessToken } = context.session;

    const res = await fetch(`${AUTH_BASE_URL}/api/auth/organization/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Satisfy Better Auth CSRF check for server-to-server calls
        Origin: AUTH_BASE_URL ?? "",
      },
      body: JSON.stringify({
        organizationId: data.organizationId,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Delete failed: ${res.status}`);
    }

    return true;
  });
