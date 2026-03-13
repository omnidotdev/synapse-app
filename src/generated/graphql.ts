// @ts-nocheck
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
  Cursor: { input: string; output: string; }
  Datetime: { input: Date; output: string; }
  UUID: { input: string; output: string; }
};

export type ApiKey = Node & {
  __typename?: 'ApiKey';
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

/** An input for mutations affecting `ApiKey` */
export type ApiKeyInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  keyHash: Scalars['String']['input'];
  keyHint: Scalars['String']['input'];
  lastUsedAt?: InputMaybe<Scalars['Datetime']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  revokedAt?: InputMaybe<Scalars['Datetime']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
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

/** Represents an update to a `ApiKey`. Fields that are set will be updated. */
export type ApiKeyPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  keyHash?: InputMaybe<Scalars['String']['input']>;
  keyHint?: InputMaybe<Scalars['String']['input']>;
  lastUsedAt?: InputMaybe<Scalars['Datetime']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  revokedAt?: InputMaybe<Scalars['Datetime']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
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

/** All input for the create `ApiKey` mutation. */
export type CreateApiKeyInput = {
  /** The `ApiKey` to be created by this mutation. */
  apiKey: ApiKeyInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `ApiKey` mutation. */
export type CreateApiKeyPayload = {
  __typename?: 'CreateApiKeyPayload';
  /** The `ApiKey` that was created by this mutation. */
  apiKey?: Maybe<ApiKey>;
  /** An edge for our `ApiKey`. May be used by Relay 1. */
  apiKeyEdge?: Maybe<ApiKeyEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ApiKey` mutation. */
export type CreateApiKeyPayloadApiKeyEdgeArgs = {
  orderBy?: Array<ApiKeyOrderBy>;
};

/** All input for the create `ProviderKey` mutation. */
export type CreateProviderKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `ProviderKey` to be created by this mutation. */
  providerKey: ProviderKeyInput;
};

/** The output of our create `ProviderKey` mutation. */
export type CreateProviderKeyPayload = {
  __typename?: 'CreateProviderKeyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProviderKey` that was created by this mutation. */
  providerKey?: Maybe<ProviderKey>;
  /** An edge for our `ProviderKey`. May be used by Relay 1. */
  providerKeyEdge?: Maybe<ProviderKeyEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProviderKey` mutation. */
export type CreateProviderKeyPayloadProviderKeyEdgeArgs = {
  orderBy?: Array<ProviderKeyOrderBy>;
};

/** All input for the create `UsageEvent` mutation. */
export type CreateUsageEventInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `UsageEvent` to be created by this mutation. */
  usageEvent: UsageEventInput;
};

/** The output of our create `UsageEvent` mutation. */
export type CreateUsageEventPayload = {
  __typename?: 'CreateUsageEventPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageEvent` that was created by this mutation. */
  usageEvent?: Maybe<UsageEvent>;
  /** An edge for our `UsageEvent`. May be used by Relay 1. */
  usageEventEdge?: Maybe<UsageEventEdge>;
};


/** The output of our create `UsageEvent` mutation. */
export type CreateUsageEventPayloadUsageEventEdgeArgs = {
  orderBy?: Array<UsageEventOrderBy>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
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

/** All input for the `deleteApiKeyById` mutation. */
export type DeleteApiKeyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ApiKey` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteApiKeyByKeyHash` mutation. */
export type DeleteApiKeyByKeyHashInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  keyHash: Scalars['String']['input'];
};

/** All input for the `deleteApiKey` mutation. */
export type DeleteApiKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ApiKey` mutation. */
export type DeleteApiKeyPayload = {
  __typename?: 'DeleteApiKeyPayload';
  /** The `ApiKey` that was deleted by this mutation. */
  apiKey?: Maybe<ApiKey>;
  /** An edge for our `ApiKey`. May be used by Relay 1. */
  apiKeyEdge?: Maybe<ApiKeyEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedApiKeyId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ApiKey` mutation. */
export type DeleteApiKeyPayloadApiKeyEdgeArgs = {
  orderBy?: Array<ApiKeyOrderBy>;
};

/** All input for the `deleteProviderKeyById` mutation. */
export type DeleteProviderKeyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProviderKey` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProviderKey` mutation. */
export type DeleteProviderKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ProviderKey` mutation. */
export type DeleteProviderKeyPayload = {
  __typename?: 'DeleteProviderKeyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProviderKeyId?: Maybe<Scalars['ID']['output']>;
  /** The `ProviderKey` that was deleted by this mutation. */
  providerKey?: Maybe<ProviderKey>;
  /** An edge for our `ProviderKey`. May be used by Relay 1. */
  providerKeyEdge?: Maybe<ProviderKeyEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProviderKey` mutation. */
export type DeleteProviderKeyPayloadProviderKeyEdgeArgs = {
  orderBy?: Array<ProviderKeyOrderBy>;
};

/** All input for the `deleteUsageEventById` mutation. */
export type DeleteUsageEventByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UsageEvent` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteUsageEvent` mutation. */
export type DeleteUsageEventInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `UsageEvent` mutation. */
export type DeleteUsageEventPayload = {
  __typename?: 'DeleteUsageEventPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUsageEventId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageEvent` that was deleted by this mutation. */
  usageEvent?: Maybe<UsageEvent>;
  /** An edge for our `UsageEvent`. May be used by Relay 1. */
  usageEventEdge?: Maybe<UsageEventEdge>;
};


/** The output of our delete `UsageEvent` mutation. */
export type DeleteUsageEventPayloadUsageEventEdgeArgs = {
  orderBy?: Array<UsageEventOrderBy>;
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteUserByIdentityProviderId` mutation. */
export type DeleteUserByIdentityProviderIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `ApiKey`. */
  createApiKey?: Maybe<CreateApiKeyPayload>;
  /** Creates a single `ProviderKey`. */
  createProviderKey?: Maybe<CreateProviderKeyPayload>;
  /** Creates a single `UsageEvent`. */
  createUsageEvent?: Maybe<CreateUsageEventPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Deletes a single `ApiKey` using a unique key. */
  deleteApiKey?: Maybe<DeleteApiKeyPayload>;
  /** Deletes a single `ApiKey` using its globally unique id. */
  deleteApiKeyById?: Maybe<DeleteApiKeyPayload>;
  /** Deletes a single `ApiKey` using a unique key. */
  deleteApiKeyByKeyHash?: Maybe<DeleteApiKeyPayload>;
  /** Deletes a single `ProviderKey` using a unique key. */
  deleteProviderKey?: Maybe<DeleteProviderKeyPayload>;
  /** Deletes a single `ProviderKey` using its globally unique id. */
  deleteProviderKeyById?: Maybe<DeleteProviderKeyPayload>;
  /** Deletes a single `UsageEvent` using a unique key. */
  deleteUsageEvent?: Maybe<DeleteUsageEventPayload>;
  /** Deletes a single `UsageEvent` using its globally unique id. */
  deleteUsageEventById?: Maybe<DeleteUsageEventPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByIdentityProviderId?: Maybe<DeleteUserPayload>;
  /** Updates a single `ApiKey` using a unique key and a patch. */
  updateApiKey?: Maybe<UpdateApiKeyPayload>;
  /** Updates a single `ApiKey` using its globally unique id and a patch. */
  updateApiKeyById?: Maybe<UpdateApiKeyPayload>;
  /** Updates a single `ApiKey` using a unique key and a patch. */
  updateApiKeyByKeyHash?: Maybe<UpdateApiKeyPayload>;
  /** Updates a single `ProviderKey` using a unique key and a patch. */
  updateProviderKey?: Maybe<UpdateProviderKeyPayload>;
  /** Updates a single `ProviderKey` using its globally unique id and a patch. */
  updateProviderKeyById?: Maybe<UpdateProviderKeyPayload>;
  /** Updates a single `UsageEvent` using a unique key and a patch. */
  updateUsageEvent?: Maybe<UpdateUsageEventPayload>;
  /** Updates a single `UsageEvent` using its globally unique id and a patch. */
  updateUsageEventById?: Maybe<UpdateUsageEventPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByIdentityProviderId?: Maybe<UpdateUserPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProviderKeyArgs = {
  input: CreateProviderKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUsageEventArgs = {
  input: CreateUsageEventInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApiKeyArgs = {
  input: DeleteApiKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApiKeyByIdArgs = {
  input: DeleteApiKeyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApiKeyByKeyHashArgs = {
  input: DeleteApiKeyByKeyHashInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProviderKeyArgs = {
  input: DeleteProviderKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProviderKeyByIdArgs = {
  input: DeleteProviderKeyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUsageEventArgs = {
  input: DeleteUsageEventInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUsageEventByIdArgs = {
  input: DeleteUsageEventByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdentityProviderIdArgs = {
  input: DeleteUserByIdentityProviderIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApiKeyArgs = {
  input: UpdateApiKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApiKeyByIdArgs = {
  input: UpdateApiKeyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApiKeyByKeyHashArgs = {
  input: UpdateApiKeyByKeyHashInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProviderKeyArgs = {
  input: UpdateProviderKeyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProviderKeyByIdArgs = {
  input: UpdateProviderKeyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUsageEventArgs = {
  input: UpdateUsageEventInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUsageEventByIdArgs = {
  input: UpdateUsageEventByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdentityProviderIdArgs = {
  input: UpdateUserByIdentityProviderIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
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

export type ProviderKey = Node & {
  __typename?: 'ProviderKey';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  encryptedKey: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  keyHint: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `ProviderKey`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
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

/** An input for mutations affecting `ProviderKey` */
export type ProviderKeyInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  encryptedKey: Scalars['String']['input'];
  keyHint: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
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

/** Represents an update to a `ProviderKey`. Fields that are set will be updated. */
export type ProviderKeyPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  encryptedKey?: InputMaybe<Scalars['String']['input']>;
  keyHint?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
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
  /** Reads and enables pagination through a set of `ApiKey`. */
  apiKeys?: Maybe<ApiKeyConnection>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
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
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UserConnection>;
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

/** All input for the `updateApiKeyById` mutation. */
export type UpdateApiKeyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ApiKey` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ApiKey` being updated. */
  patch: ApiKeyPatch;
};

/** All input for the `updateApiKeyByKeyHash` mutation. */
export type UpdateApiKeyByKeyHashInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  keyHash: Scalars['String']['input'];
  /** An object where the defined keys will be set on the `ApiKey` being updated. */
  patch: ApiKeyPatch;
};

/** All input for the `updateApiKey` mutation. */
export type UpdateApiKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ApiKey` being updated. */
  patch: ApiKeyPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ApiKey` mutation. */
export type UpdateApiKeyPayload = {
  __typename?: 'UpdateApiKeyPayload';
  /** The `ApiKey` that was updated by this mutation. */
  apiKey?: Maybe<ApiKey>;
  /** An edge for our `ApiKey`. May be used by Relay 1. */
  apiKeyEdge?: Maybe<ApiKeyEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ApiKey` mutation. */
export type UpdateApiKeyPayloadApiKeyEdgeArgs = {
  orderBy?: Array<ApiKeyOrderBy>;
};

/** All input for the `updateProviderKeyById` mutation. */
export type UpdateProviderKeyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProviderKey` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ProviderKey` being updated. */
  patch: ProviderKeyPatch;
};

/** All input for the `updateProviderKey` mutation. */
export type UpdateProviderKeyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ProviderKey` being updated. */
  patch: ProviderKeyPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ProviderKey` mutation. */
export type UpdateProviderKeyPayload = {
  __typename?: 'UpdateProviderKeyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProviderKey` that was updated by this mutation. */
  providerKey?: Maybe<ProviderKey>;
  /** An edge for our `ProviderKey`. May be used by Relay 1. */
  providerKeyEdge?: Maybe<ProviderKeyEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProviderKey` mutation. */
export type UpdateProviderKeyPayloadProviderKeyEdgeArgs = {
  orderBy?: Array<ProviderKeyOrderBy>;
};

/** All input for the `updateUsageEventById` mutation. */
export type UpdateUsageEventByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UsageEvent` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `UsageEvent` being updated. */
  patch: UsageEventPatch;
};

/** All input for the `updateUsageEvent` mutation. */
export type UpdateUsageEventInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `UsageEvent` being updated. */
  patch: UsageEventPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `UsageEvent` mutation. */
export type UpdateUsageEventPayload = {
  __typename?: 'UpdateUsageEventPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UsageEvent` that was updated by this mutation. */
  usageEvent?: Maybe<UsageEvent>;
  /** An edge for our `UsageEvent`. May be used by Relay 1. */
  usageEventEdge?: Maybe<UsageEventEdge>;
};


/** The output of our update `UsageEvent` mutation. */
export type UpdateUsageEventPayloadUsageEventEdgeArgs = {
  orderBy?: Array<UsageEventOrderBy>;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUserByIdentityProviderId` mutation. */
export type UpdateUserByIdentityProviderIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
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

/** An input for mutations affecting `UsageEvent` */
export type UsageEventInput = {
  apiKeyId: Scalars['UUID']['input'];
  costCents?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  inputTokens?: InputMaybe<Scalars['Int']['input']>;
  mode: Scalars['String']['input'];
  model: Scalars['String']['input'];
  outputTokens?: InputMaybe<Scalars['Int']['input']>;
  provider: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  userId: Scalars['UUID']['input'];
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
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

/** Represents an update to a `UsageEvent`. Fields that are set will be updated. */
export type UsageEventPatch = {
  apiKeyId?: InputMaybe<Scalars['UUID']['input']>;
  costCents?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  inputTokens?: InputMaybe<Scalars['Int']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  outputTokens?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

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
  /** Reads and enables pagination through a set of `ProviderKey`. */
  providerKeys: ProviderKeyConnection;
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `UsageEvent`. */
  usageEvents: UsageEventConnection;
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
};

/** An input for mutations affecting `User` */
export type UserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
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

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
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

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users?: { __typename?: 'UserConnection', totalCount: number } | null };



export const UsersDocument = `
    query Users {
  users {
    totalCount
  }
}
    `;

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
