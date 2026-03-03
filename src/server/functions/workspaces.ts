import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { SYNAPSE_API_URL } from "@/lib/config/env.config";
import { authMiddleware } from "@/server/middleware";

import type { Workspace } from "@/lib/context/workspace.context";

const API_GRAPHQL_URL = `${SYNAPSE_API_URL}/graphql`;

/**
 * Execute a GraphQL query against synapse-api
 */
const graphql = async <T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const res = await fetch(API_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};

/**
 * List workspaces for an organization
 */
export const listWorkspaces = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) =>
    z.object({ organizationId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data, context }): Promise<Workspace[]> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ orgWorkspaces: Workspace[] }>(
      accessToken,
      `query OrgWorkspaces($organizationId: UUID!) {
        orgWorkspaces(organizationId: $organizationId) {
          id
          organizationId
          name
          slug
        }
      }`,
      { organizationId: data.organizationId },
    );

    return result.orgWorkspaces;
  });

const createSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

/**
 * Create a new workspace
 */
export const addWorkspace = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => createSchema.parse(data))
  .handler(async ({ data, context }): Promise<Workspace> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ addWorkspace: Workspace }>(
      accessToken,
      `mutation CreateWorkspace($input: NewWorkspaceInput!) {
        addWorkspace(input: $input) {
          id
          organizationId
          name
          slug
        }
      }`,
      { input: data },
    );

    return result.addWorkspace;
  });

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

/**
 * Update a workspace
 */
export const patchWorkspace = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => updateSchema.parse(data))
  .handler(async ({ data, context }): Promise<Workspace> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const { id, ...input } = data;

    const result = await graphql<{ patchWorkspace: Workspace }>(
      accessToken,
      `mutation UpdateWorkspace($id: UUID!, $input: PatchWorkspaceInput!) {
        patchWorkspace(id: $id, input: $input) {
          id
          organizationId
          name
          slug
        }
      }`,
      { id, input },
    );

    return result.patchWorkspace;
  });

/**
 * Delete a workspace
 */
export const removeWorkspace = createServerFn()
  .middleware([authMiddleware])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }): Promise<boolean> => {
    const accessToken = context.session.accessToken;
    if (!accessToken) throw new Error("Access token required");

    const result = await graphql<{ removeWorkspace: boolean }>(
      accessToken,
      `mutation DeleteWorkspace($id: UUID!) {
        removeWorkspace(id: $id)
      }`,
      { id: data.id },
    );

    return result.removeWorkspace;
  });
