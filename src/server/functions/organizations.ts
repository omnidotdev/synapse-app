import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AUTH_BASE_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";
import { requirePermission } from "./authorization";

interface Member {
  id: string;
  userId: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

/**
 * Fetch organization members from Gatekeeper
 */
export const getOrgMembers = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) =>
    z.object({ organizationId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<Member[]> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "viewer",
    );

    const { accessToken } = context.session;

    const res = await fetch(
      `${AUTH_BASE_URL}/api/organization/members?orgId=${data.organizationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);

    const json = await res.json();

    return json.data ?? [];
  });

const inviteSchema = z.object({
  organizationId: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Invite a member to an organization via Gatekeeper
 */
export const inviteOrgMember = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => inviteSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const { accessToken } = context.session;

    const res = await fetch(
      `${AUTH_BASE_URL}/api/auth/organization/invite-member`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // Satisfy Better Auth CSRF check for server-to-server calls
          Origin: AUTH_BASE_URL!,
        },
        body: JSON.stringify({
          organizationId: data.organizationId,
          email: data.email,
          role: data.role,
        }),
      },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message ?? `Invite failed: ${res.status}`);
    }

    return true;
  });

const updateRoleSchema = z.object({
  organizationId: z.string().min(1),
  memberId: z.string().min(1),
  role: z.enum(["admin", "member"]),
});

/**
 * Update a member's role in an organization
 */
export const updateMemberRole = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => updateRoleSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const { accessToken } = context.session;

    const res = await fetch(
      `${AUTH_BASE_URL}/api/organization/members?orgId=${data.organizationId}&memberId=${data.memberId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ role: data.role }),
      },
    );

    if (!res.ok) throw new Error(`Role update failed: ${res.status}`);

    return true;
  });

const removeMemberSchema = z.object({
  organizationId: z.string().min(1),
  memberId: z.string().min(1),
});

/**
 * Remove a member from an organization
 */
export const removeMember = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => removeMemberSchema.parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    await requirePermission(
      context.session.user.id,
      "organization",
      data.organizationId,
      "admin",
    );

    const { accessToken } = context.session;

    const res = await fetch(
      `${AUTH_BASE_URL}/api/organization/members?orgId=${data.organizationId}&memberId=${data.memberId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!res.ok) throw new Error(`Remove member failed: ${res.status}`);

    return true;
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
        Origin: AUTH_BASE_URL!,
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
        Origin: AUTH_BASE_URL!,
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

export type { Member };
