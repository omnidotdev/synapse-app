import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AUTH_BASE_URL } from "@/lib/config/env.config";
import gatekeeperOrg from "@/lib/config/gatekeeper";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

export type { GatekeeperOrganization as Organization } from "@omnidotdev/providers/auth";

const createOrganizationSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
  slug: z.string().optional(),
});

const getOrganizationBySlugSchema = z.object({
  slug: z.string().min(1),
});

/**
 * Create a new organization via Gatekeeper
 * @knipignore
 */
export const createOrganization = createServerFn({ method: "POST" })
  .inputValidator((data) => createOrganizationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.createOrganization(data, accessToken);
  });

const inviteOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Invite a member to an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint.
 * Dedup and membership validation is handled by Gatekeeper
 */
export const inviteOrganizationMember = createServerFn({ method: "POST" })
  .inputValidator((data) => inviteOrganizationMemberSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.inviteMember(data, accessToken);
  });

const listOrganizationInvitationsSchema = z.object({
  organizationId: z.string(),
});

/**
 * List invitations for an organization via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint
 */
export const listOrganizationInvitations = createServerFn({ method: "GET" })
  .inputValidator((data) => listOrganizationInvitationsSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "viewer",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.listInvitations(data.organizationId, accessToken);
  });

const cancelOrganizationInvitationSchema = z.object({
  organizationId: z.string(),
  invitationId: z.string(),
});

/**
 * Cancel an organization invitation via Gatekeeper.
 * Runs server-side to avoid CORS issues with the IDP's Better Auth endpoint
 */
export const cancelOrganizationInvitation = createServerFn({ method: "POST" })
  .inputValidator((data) => cancelOrganizationInvitationSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.cancelInvitation(data.invitationId, accessToken);
  });

/**
 * Get an organization by slug.
 * Used when JWT claims are stale and don't include a newly created org
 */
export const getOrganizationBySlug = createServerFn({ method: "GET" })
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
export const fetchOrganizationBySlug = createServerFn()
  .inputValidator((data) => getOrganizationBySlugSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      return await gatekeeperOrg.fetchOrganizationBySlug(data.slug);
    } catch (error) {
      console.error("Error fetching organization by slug:", error);
      return null;
    }
  });

const listOrganizationMembersSchema = z.object({
  organizationId: z.string(),
});

/**
 * List members for an organization via Gatekeeper
 */
export const listOrganizationMembers = createServerFn({ method: "GET" })
  .inputValidator((data) => listOrganizationMembersSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "viewer",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const result = await gatekeeperOrg.listMembers(
      data.organizationId,
      accessToken,
    );

    return result.data ?? [];
  });

const updateOrganizationMemberRoleSchema = z.object({
  organizationId: z.string(),
  memberId: z.string(),
  role: z.enum(["admin", "member"]),
});

/**
 * Update a member's role via Gatekeeper
 */
export const updateOrganizationMemberRole = createServerFn({ method: "POST" })
  .inputValidator((data) => updateOrganizationMemberRoleSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.updateMemberRole(data, accessToken);
  });

const removeOrganizationMemberSchema = z.object({
  organizationId: z.string(),
  memberId: z.string(),
});

/**
 * Remove a member from an organization via Gatekeeper
 */
export const removeOrganizationMember = createServerFn({ method: "POST" })
  .inputValidator((data) => removeOrganizationMemberSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const accessToken = context.session.accessToken;

    if (!accessToken) {
      throw new Error("No access token available");
    }

    return gatekeeperOrg.removeMember(data, accessToken);
  });

const updateOrgSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
});

/**
 * Update organization details via Better Auth
 */
export const updateOrganization = createServerFn()
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
export const deleteOrganization = createServerFn()
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
