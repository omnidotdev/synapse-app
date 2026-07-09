// @ts-nocheck
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { graphqlFetch } from '@/lib/graphql/graphqlFetch';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: string; output: string; }
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
   * 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
   * that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
   * to unexpected results.
   */
  Datetime: { input: Date; output: string; }
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: { input: string; output: string; }
};

export type ApiKey = Node & {
  __typename?: 'ApiKey';
  /** Reads and enables pagination through a set of `ApiKeyProvider`. */
  apiKeyProviders: ApiKeyProviderConnection;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  expiresAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  keyHash: Scalars['String']['output'];
  keyHint: Scalars['String']['output'];
  lastUsedAt?: Maybe<Scalars['Datetime']['output']>;
  mode: Scalars['String']['output'];
  name: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['Datetime']['output']>;
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `UsageEvent`. */
  usageEvents: UsageEventConnection;
  /** Reads a single `User` that is related to this `ApiKey`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
  workspaceId?: Maybe<Scalars['UUID']['output']>;
};


export type ApiKeyApiKeyProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ApiKeyProviderCondition>;
  filter?: InputMaybe<ApiKeyProviderFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ApiKeyProviderOrderBy>>;
};


export type ApiKeyUsageEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageEventCondition>;
  filter?: InputMaybe<UsageEventFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageEventOrderBy>>;
};

/** A condition to be used against `ApiKey` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApiKeyCondition = {
  /** Checks for equality with the object’s `keyHash` field. */
  keyHash?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ApiKey` values. */
export type ApiKeyConnection = {
  __typename?: 'ApiKeyConnection';
  /** A list of edges which contains the `ApiKey` and cursor to aid in pagination. */
  edges: Array<Maybe<ApiKeyEdge>>;
  /** A list of `ApiKey` objects. */
  nodes: Array<Maybe<ApiKey>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApiKey` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ApiKey` edge in the connection. */
export type ApiKeyEdge = {
  __typename?: 'ApiKeyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ApiKey` at the end of the edge. */
  node?: Maybe<ApiKey>;
};

/** A filter to be used against `ApiKey` object types. All fields are combined with a logical ‘and.’ */
export type ApiKeyFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ApiKeyFilter>>;
  /** Filter by the object’s `apiKeyProviders` relation. */
  apiKeyProviders?: InputMaybe<ApiKeyToManyApiKeyProviderFilter>;
  /** Some related `apiKeyProviders` exist. */
  apiKeyProvidersExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `keyHash` field. */
  keyHash?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ApiKeyFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ApiKeyFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `usageEvents` relation. */
  usageEvents?: InputMaybe<ApiKeyToManyUsageEventFilter>;
  /** Some related `usageEvents` exist. */
  usageEventsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

export type ApiKeyInfo = {
  __typename?: 'ApiKeyInfo';
  createdAt: Scalars['Datetime']['output'];
  expiresAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  keyHint: Scalars['String']['output'];
  lastUsedAt?: Maybe<Scalars['Datetime']['output']>;
  linkedProviders: Array<LinkedProviderInfo>;
  mode: Scalars['String']['output'];
  name: Scalars['String']['output'];
  revokedAt?: Maybe<Scalars['Datetime']['output']>;
};

/** Methods to use when ordering `ApiKey`. */
export enum ApiKeyOrderBy {
  KeyHashAsc = 'KEY_HASH_ASC',
  KeyHashDesc = 'KEY_HASH_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type ApiKeyProvider = Node & {
  __typename?: 'ApiKeyProvider';
  /** Reads a single `ApiKey` that is related to this `ApiKeyProvider`. */
  apiKey?: Maybe<ApiKey>;
  apiKeyId: Scalars['UUID']['output'];
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `ProviderKey` that is related to this `ApiKeyProvider`. */
  providerKey?: Maybe<ProviderKey>;
  providerKeyId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `ApiKeyProvider` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ApiKeyProviderCondition = {
  /** Checks for equality with the object’s `apiKeyId` field. */
  apiKeyId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `providerKeyId` field. */
  providerKeyId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ApiKeyProvider` values. */
export type ApiKeyProviderConnection = {
  __typename?: 'ApiKeyProviderConnection';
  /** A list of edges which contains the `ApiKeyProvider` and cursor to aid in pagination. */
  edges: Array<Maybe<ApiKeyProviderEdge>>;
  /** A list of `ApiKeyProvider` objects. */
  nodes: Array<Maybe<ApiKeyProvider>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApiKeyProvider` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ApiKeyProvider` edge in the connection. */
export type ApiKeyProviderEdge = {
  __typename?: 'ApiKeyProviderEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ApiKeyProvider` at the end of the edge. */
  node?: Maybe<ApiKeyProvider>;
};

/** A filter to be used against `ApiKeyProvider` object types. All fields are combined with a logical ‘and.’ */
export type ApiKeyProviderFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ApiKeyProviderFilter>>;
  /** Filter by the object’s `apiKey` relation. */
  apiKey?: InputMaybe<ApiKeyFilter>;
  /** Filter by the object’s `apiKeyId` field. */
  apiKeyId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ApiKeyProviderFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ApiKeyProviderFilter>>;
  /** Filter by the object’s `providerKey` relation. */
  providerKey?: InputMaybe<ProviderKeyFilter>;
  /** Filter by the object’s `providerKeyId` field. */
  providerKeyId?: InputMaybe<UuidFilter>;
};

/** Methods to use when ordering `ApiKeyProvider`. */
export enum ApiKeyProviderOrderBy {
  ApiKeyIdAsc = 'API_KEY_ID_ASC',
  ApiKeyIdDesc = 'API_KEY_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderKeyIdAsc = 'PROVIDER_KEY_ID_ASC',
  ProviderKeyIdDesc = 'PROVIDER_KEY_ID_DESC'
}

/** A filter to be used against many `ApiKeyProvider` object types. All fields are combined with a logical ‘and.’ */
export type ApiKeyToManyApiKeyProviderFilter = {
  /** Every related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ApiKeyProviderFilter>;
  /** No related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ApiKeyProviderFilter>;
  /** Some related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ApiKeyProviderFilter>;
};

/** A filter to be used against many `UsageEvent` object types. All fields are combined with a logical ‘and.’ */
export type ApiKeyToManyUsageEventFilter = {
  /** Every related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<UsageEventFilter>;
  /** No related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<UsageEventFilter>;
  /** Some related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<UsageEventFilter>;
};

export type DailyUsage = {
  __typename?: 'DailyUsage';
  date: Scalars['String']['output'];
  inputTokens: Scalars['Int']['output'];
  outputTokens: Scalars['Int']['output'];
  requests: Scalars['Int']['output'];
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export type GenerateApiKeyInput = {
  mode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

export type GenerateApiKeyPayload = {
  __typename?: 'GenerateApiKeyPayload';
  apiKeyId: Scalars['UUID']['output'];
  keyHint: Scalars['String']['output'];
  rawKey: Scalars['String']['output'];
};

export type LinkedProviderInfo = {
  __typename?: 'LinkedProviderInfo';
  id: Scalars['UUID']['output'];
  keyHint: Scalars['String']['output'];
  provider: Scalars['String']['output'];
};

export type ModelBreakdown = {
  __typename?: 'ModelBreakdown';
  inputTokens: Scalars['Int']['output'];
  model: Scalars['String']['output'];
  outputTokens: Scalars['Int']['output'];
  provider: Scalars['String']['output'];
  requests: Scalars['Int']['output'];
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new workspace within an organization */
  addWorkspace?: Maybe<WorkspaceResult>;
  /** Generate a new API key. The raw key is returned once and never stored. */
  generateApiKey?: Maybe<GenerateApiKeyPayload>;
  /** Link a provider key to an API key so requests use that provider. */
  linkProviderKey?: Maybe<Scalars['Boolean']['output']>;
  /** Update a workspace's details */
  patchWorkspace?: Maybe<WorkspaceResult>;
  /** Delete a provider key. Verifies ownership before deletion. */
  removeProviderKey?: Maybe<Scalars['Boolean']['output']>;
  /** Delete a workspace */
  removeWorkspace?: Maybe<Scalars['Boolean']['output']>;
  /** Revoke an API key by setting its revokedAt timestamp. */
  revokeApiKey?: Maybe<Scalars['Boolean']['output']>;
  /** Encrypt and upsert a BYOK provider key. */
  setProviderKey?: Maybe<ProviderKeyInfo>;
  /** Unlink a provider key from an API key. */
  unlinkProviderKey?: Maybe<Scalars['Boolean']['output']>;
  /** Update user preferences. Creates preferences row if it doesn't exist. */
  updateUserPreferences?: Maybe<UserPreferences>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationAddWorkspaceArgs = {
  input: NewWorkspaceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationGenerateApiKeyArgs = {
  input: GenerateApiKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationLinkProviderKeyArgs = {
  apiKeyId: Scalars['UUID']['input'];
  providerKeyId: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPatchWorkspaceArgs = {
  id: Scalars['UUID']['input'];
  input: PatchWorkspaceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRemoveProviderKeyArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRemoveWorkspaceArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationRevokeApiKeyArgs = {
  id: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSetProviderKeyArgs = {
  input: SetProviderKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUnlinkProviderKeyArgs = {
  apiKeyId: Scalars['UUID']['input'];
  providerKeyId: Scalars['UUID']['input'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserPreferencesArgs = {
  input: UpdateUserPreferencesInput;
};

export type NewWorkspaceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['UUID']['input'];
  slug: Scalars['String']['input'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

export type Observer = {
  __typename?: 'Observer';
  /** List active API keys for the current user, optionally filtered by workspace. */
  apiKeys: Array<ApiKeyInfo>;
  email: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  /** Fetch current user's preferences. */
  preferences?: Maybe<UserPreferences>;
  /** List provider keys for the current user. */
  providerKeys: Array<ProviderKeyInfo>;
};


export type ObserverApiKeysArgs = {
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PatchWorkspaceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type ProviderKey = Node & {
  __typename?: 'ProviderKey';
  /** Reads and enables pagination through a set of `ApiKeyProvider`. */
  apiKeyProviders: ApiKeyProviderConnection;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  encryptedKey: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  keyHint: Scalars['String']['output'];
  modelPreference?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `ProviderKey`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};


export type ProviderKeyApiKeyProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ApiKeyProviderCondition>;
  filter?: InputMaybe<ApiKeyProviderFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ApiKeyProviderOrderBy>>;
};

/**
 * A condition to be used against `ProviderKey` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type ProviderKeyCondition = {
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ProviderKey` values. */
export type ProviderKeyConnection = {
  __typename?: 'ProviderKeyConnection';
  /** A list of edges which contains the `ProviderKey` and cursor to aid in pagination. */
  edges: Array<Maybe<ProviderKeyEdge>>;
  /** A list of `ProviderKey` objects. */
  nodes: Array<Maybe<ProviderKey>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProviderKey` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ProviderKey` edge in the connection. */
export type ProviderKeyEdge = {
  __typename?: 'ProviderKeyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProviderKey` at the end of the edge. */
  node?: Maybe<ProviderKey>;
};

/** A filter to be used against `ProviderKey` object types. All fields are combined with a logical ‘and.’ */
export type ProviderKeyFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProviderKeyFilter>>;
  /** Filter by the object’s `apiKeyProviders` relation. */
  apiKeyProviders?: InputMaybe<ProviderKeyToManyApiKeyProviderFilter>;
  /** Some related `apiKeyProviders` exist. */
  apiKeyProvidersExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<ProviderKeyFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProviderKeyFilter>>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

export type ProviderKeyInfo = {
  __typename?: 'ProviderKeyInfo';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['UUID']['output'];
  keyHint: Scalars['String']['output'];
  modelPreference?: Maybe<Scalars['String']['output']>;
  provider: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  userId: Scalars['UUID']['output'];
};

/** Methods to use when ordering `ProviderKey`. */
export enum ProviderKeyOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** A filter to be used against many `ApiKeyProvider` object types. All fields are combined with a logical ‘and.’ */
export type ProviderKeyToManyApiKeyProviderFilter = {
  /** Every related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ApiKeyProviderFilter>;
  /** No related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ApiKeyProviderFilter>;
  /** Some related `ApiKeyProvider` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ApiKeyProviderFilter>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Get a single `ApiKey`. */
  apiKey?: Maybe<ApiKey>;
  /** Reads a single `ApiKey` using its globally unique `ID`. */
  apiKeyById?: Maybe<ApiKey>;
  /** Get a single `ApiKey`. */
  apiKeyByKeyHash?: Maybe<ApiKey>;
  /** Get a single `ApiKeyProvider`. */
  apiKeyProvider?: Maybe<ApiKeyProvider>;
  /** Reads a single `ApiKeyProvider` using its globally unique `ID`. */
  apiKeyProviderById?: Maybe<ApiKeyProvider>;
  /** Reads and enables pagination through a set of `ApiKeyProvider`. */
  apiKeyProviders?: Maybe<ApiKeyProviderConnection>;
  /** Reads and enables pagination through a set of `ApiKey`. */
  apiKeys?: Maybe<ApiKeyConnection>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The currently authenticated user. Returns null if not authenticated. */
  observer?: Maybe<Observer>;
  /** List workspaces for an organization */
  orgWorkspaces: Array<WorkspaceResult>;
  /** Get a single `ProviderKey`. */
  providerKey?: Maybe<ProviderKey>;
  /** Reads a single `ProviderKey` using its globally unique `ID`. */
  providerKeyById?: Maybe<ProviderKey>;
  /** Reads and enables pagination through a set of `ProviderKey`. */
  providerKeys?: Maybe<ProviderKeyConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /**
   * Aggregated usage breakdown by model and day for charts.
   * Optionally filter by workspaceId for workspace-scoped usage.
   */
  usageBreakdown?: Maybe<UsageBreakdown>;
  /** Get a single `UsageEvent`. */
  usageEvent?: Maybe<UsageEvent>;
  /** Reads a single `UsageEvent` using its globally unique `ID`. */
  usageEventById?: Maybe<UsageEvent>;
  /** Reads and enables pagination through a set of `UsageEvent`. */
  usageEvents?: Maybe<UsageEventConnection>;
  /** Get a single `User`. */
  user?: Maybe<User>;
  /** Reads a single `User` using its globally unique `ID`. */
  userById?: Maybe<User>;
  /** Get a single `User`. */
  userByIdentityProviderId?: Maybe<User>;
  /** Get a single `UserPreference`. */
  userPreference?: Maybe<UserPreference>;
  /** Reads a single `UserPreference` using its globally unique `ID`. */
  userPreferenceById?: Maybe<UserPreference>;
  /** Get a single `UserPreference`. */
  userPreferenceByUserId?: Maybe<UserPreference>;
  /** Reads and enables pagination through a set of `UserPreference`. */
  userPreferences?: Maybe<UserPreferenceConnection>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UserConnection>;
  /** Get a single `Workspace`. */
  workspace?: Maybe<Workspace>;
  /** Reads a single `Workspace` using its globally unique `ID`. */
  workspaceById?: Maybe<Workspace>;
  /** Reads and enables pagination through a set of `Workspace`. */
  workspaces?: Maybe<WorkspaceConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyByKeyHashArgs = {
  keyHash: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyProviderArgs = {
  apiKeyId: Scalars['UUID']['input'];
  providerKeyId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyProviderByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeyProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ApiKeyProviderCondition>;
  filter?: InputMaybe<ApiKeyProviderFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ApiKeyProviderOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApiKeysArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ApiKeyCondition>;
  filter?: InputMaybe<ApiKeyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ApiKeyOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrgWorkspacesArgs = {
  organizationId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProviderKeyArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProviderKeyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProviderKeysArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProviderKeyCondition>;
  filter?: InputMaybe<ProviderKeyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProviderKeyOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageBreakdownArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  workspaceId?: InputMaybe<Scalars['String']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageEventArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageEventByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsageEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageEventCondition>;
  filter?: InputMaybe<UsageEventFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageEventOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdentityProviderIdArgs = {
  identityProviderId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceByUserIdArgs = {
  userId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferencesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserPreferenceCondition>;
  filter?: InputMaybe<UserPreferenceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserPreferenceOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserCondition>;
  filter?: InputMaybe<UserFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspacesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkspaceCondition>;
  filter?: InputMaybe<WorkspaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkspaceOrderBy>>;
};

export type SetProviderKeyInput = {
  key: Scalars['String']['input'];
  provider: Scalars['String']['input'];
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type UpdateUserPreferencesInput = {
  defaultProvider?: InputMaybe<Scalars['String']['input']>;
  notifyKeyExpiry?: InputMaybe<Scalars['Boolean']['input']>;
  notifyUsageThreshold?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UsageBreakdown = {
  __typename?: 'UsageBreakdown';
  byDay: Array<DailyUsage>;
  byModel: Array<ModelBreakdown>;
};

export type UsageEvent = Node & {
  __typename?: 'UsageEvent';
  /** Reads a single `ApiKey` that is related to this `UsageEvent`. */
  apiKey?: Maybe<ApiKey>;
  apiKeyId: Scalars['UUID']['output'];
  costCents: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  inputTokens: Scalars['Int']['output'];
  mode: Scalars['String']['output'];
  model: Scalars['String']['output'];
  outputTokens: Scalars['Int']['output'];
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `User` that is related to this `UsageEvent`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
  workspaceId?: Maybe<Scalars['UUID']['output']>;
};

/**
 * A condition to be used against `UsageEvent` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type UsageEventCondition = {
  /** Checks for equality with the object’s `apiKeyId` field. */
  apiKeyId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `UsageEvent` values. */
export type UsageEventConnection = {
  __typename?: 'UsageEventConnection';
  /** A list of edges which contains the `UsageEvent` and cursor to aid in pagination. */
  edges: Array<Maybe<UsageEventEdge>>;
  /** A list of `UsageEvent` objects. */
  nodes: Array<Maybe<UsageEvent>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UsageEvent` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `UsageEvent` edge in the connection. */
export type UsageEventEdge = {
  __typename?: 'UsageEventEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UsageEvent` at the end of the edge. */
  node?: Maybe<UsageEvent>;
};

/** A filter to be used against `UsageEvent` object types. All fields are combined with a logical ‘and.’ */
export type UsageEventFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UsageEventFilter>>;
  /** Filter by the object’s `apiKey` relation. */
  apiKey?: InputMaybe<ApiKeyFilter>;
  /** Filter by the object’s `apiKeyId` field. */
  apiKeyId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UsageEventFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UsageEventFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** Methods to use when ordering `UsageEvent`. */
export enum UsageEventOrderBy {
  ApiKeyIdAsc = 'API_KEY_ID_ASC',
  ApiKeyIdDesc = 'API_KEY_ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type User = Node & {
  __typename?: 'User';
  /** Reads and enables pagination through a set of `ApiKey`. */
  apiKeys: ApiKeyConnection;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  identityProviderId: Scalars['UUID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  plan: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `ProviderKey`. */
  providerKeys: ProviderKeyConnection;
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `UsageEvent`. */
  usageEvents: UsageEventConnection;
  /** Reads a single `UserPreference` that is related to this `User`. */
  userPreference?: Maybe<UserPreference>;
};


export type UserApiKeysArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ApiKeyCondition>;
  filter?: InputMaybe<ApiKeyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ApiKeyOrderBy>>;
};


export type UserProviderKeysArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProviderKeyCondition>;
  filter?: InputMaybe<ProviderKeyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProviderKeyOrderBy>>;
};


export type UserUsageEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UsageEventCondition>;
  filter?: InputMaybe<UsageEventFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsageEventOrderBy>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `User` values. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<Maybe<UserEdge>>;
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node?: Maybe<User>;
};

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `apiKeys` relation. */
  apiKeys?: InputMaybe<UserToManyApiKeyFilter>;
  /** Some related `apiKeys` exist. */
  apiKeysExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `providerKeys` relation. */
  providerKeys?: InputMaybe<UserToManyProviderKeyFilter>;
  /** Some related `providerKeys` exist. */
  providerKeysExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `usageEvents` relation. */
  usageEvents?: InputMaybe<UserToManyUsageEventFilter>;
  /** Some related `usageEvents` exist. */
  usageEventsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `userPreference` relation. */
  userPreference?: InputMaybe<UserPreferenceFilter>;
  /** A related `userPreference` exists. */
  userPreferenceExists?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Methods to use when ordering `User`. */
export enum UserOrderBy {
  IdentityProviderIdAsc = 'IDENTITY_PROVIDER_ID_ASC',
  IdentityProviderIdDesc = 'IDENTITY_PROVIDER_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

export type UserPreference = Node & {
  __typename?: 'UserPreference';
  defaultProvider?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  notifyKeyExpiry: Scalars['Boolean']['output'];
  notifyUsageThreshold: Scalars['Boolean']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `UserPreference`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `UserPreference` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type UserPreferenceCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `UserPreference` values. */
export type UserPreferenceConnection = {
  __typename?: 'UserPreferenceConnection';
  /** A list of edges which contains the `UserPreference` and cursor to aid in pagination. */
  edges: Array<Maybe<UserPreferenceEdge>>;
  /** A list of `UserPreference` objects. */
  nodes: Array<Maybe<UserPreference>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserPreference` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `UserPreference` edge in the connection. */
export type UserPreferenceEdge = {
  __typename?: 'UserPreferenceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UserPreference` at the end of the edge. */
  node?: Maybe<UserPreference>;
};

/** A filter to be used against `UserPreference` object types. All fields are combined with a logical ‘and.’ */
export type UserPreferenceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserPreferenceFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<UserPreferenceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserPreferenceFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** Methods to use when ordering `UserPreference`. */
export enum UserPreferenceOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type UserPreferences = {
  __typename?: 'UserPreferences';
  defaultProvider?: Maybe<Scalars['String']['output']>;
  notifyKeyExpiry: Scalars['Boolean']['output'];
  notifyUsageThreshold: Scalars['Boolean']['output'];
};

/** A filter to be used against many `ApiKey` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyApiKeyFilter = {
  /** Every related `ApiKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ApiKeyFilter>;
  /** No related `ApiKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ApiKeyFilter>;
  /** Some related `ApiKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ApiKeyFilter>;
};

/** A filter to be used against many `ProviderKey` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyProviderKeyFilter = {
  /** Every related `ProviderKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProviderKeyFilter>;
  /** No related `ProviderKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProviderKeyFilter>;
  /** Some related `ProviderKey` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProviderKeyFilter>;
};

/** A filter to be used against many `UsageEvent` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyUsageEventFilter = {
  /** Every related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<UsageEventFilter>;
  /** No related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<UsageEventFilter>;
  /** Some related `UsageEvent` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<UsageEventFilter>;
};

export type Workspace = Node & {
  __typename?: 'Workspace';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `Workspace` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkspaceCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Workspace` values. */
export type WorkspaceConnection = {
  __typename?: 'WorkspaceConnection';
  /** A list of edges which contains the `Workspace` and cursor to aid in pagination. */
  edges: Array<Maybe<WorkspaceEdge>>;
  /** A list of `Workspace` objects. */
  nodes: Array<Maybe<Workspace>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Workspace` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Workspace` edge in the connection. */
export type WorkspaceEdge = {
  __typename?: 'WorkspaceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Workspace` at the end of the edge. */
  node?: Maybe<Workspace>;
};

/** A filter to be used against `Workspace` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkspaceFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<WorkspaceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WorkspaceFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `slug` field. */
  slug?: InputMaybe<StringFilter>;
};

/** Methods to use when ordering `Workspace`. */
export enum WorkspaceOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  SlugAsc = 'SLUG_ASC',
  SlugDesc = 'SLUG_DESC'
}

export type WorkspaceResult = {
  __typename?: 'WorkspaceResult';
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['UUID']['output'];
  slug: Scalars['String']['output'];
};

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: { __typename?: 'UserConnection', totalCount: number } | null };


export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const UsersDocument = new TypedDocumentString(`
    query Users {
  users {
    totalCount
  }
}
    `);

export const useUsersQuery = <
      TData = UsersQuery,
      TError = unknown
    >(
      variables?: UsersQueryVariables,
      options?: Omit<UseQueryOptions<UsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UsersQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['Users'] : ['Users', variables],
    queryFn: graphqlFetch<UsersQuery, UsersQueryVariables>(UsersDocument, variables),
    ...options
  }
    )};

useUsersQuery.getKey = (variables?: UsersQueryVariables) => variables === undefined ? ['Users'] : ['Users', variables];

export const useInfiniteUsersQuery = <
      TData = InfiniteData<UsersQuery>,
      TError = unknown
    >(
      variables: UsersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UsersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UsersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UsersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? variables === undefined ? ['Users.infinite'] : ['Users.infinite', variables],
      queryFn: (metaData) => graphqlFetch<UsersQuery, UsersQueryVariables>(UsersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUsersQuery.getKey = (variables?: UsersQueryVariables) => variables === undefined ? ['Users.infinite'] : ['Users.infinite', variables];


useUsersQuery.fetcher = (variables?: UsersQueryVariables, options?: RequestInit['headers']) => graphqlFetch<UsersQuery, UsersQueryVariables>(UsersDocument, variables, options);
