import type { RequestHandler } from "msw";

/**
 * GraphQL MSW handlers using generated mocks from GraphQL CodeGen. Add one per
 * operation a test exercises
 */
export const graphqlHandlers: RequestHandler[] = [];
