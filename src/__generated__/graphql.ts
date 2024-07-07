/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** BigInt custom scalar type */
  BigInt: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  attention?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  zip: Scalars['String']['output'];
};

export type AddressInput = {
  attention?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  zip: Scalars['String']['input'];
};

export type AddressInputWithPolymorphic = {
  addressableId: Scalars['String']['input'];
  addressableType: AddressableType;
  attention?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  zip: Scalars['String']['input'];
};

/** Polymorphic name of address */
export enum AddressableType {
  Invoice = 'INVOICE',
  Organization = 'ORGANIZATION'
}

export type AssignUserInput = {
  userGroupId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateOrganizationInput = {
  addresses?: InputMaybe<Array<AddressInput>>;
  avatarFileId?: InputMaybe<Scalars['ID']['input']>;
  avatarFileUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type CreateUserGroupInput = {
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  parentId: Scalars['String']['input'];
  permissions: Scalars['JSONObject']['input'];
};

export type CreateUserInput = {
  avatarFileId?: InputMaybe<Scalars['ID']['input']>;
  avatarFileUrl?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  isApUser?: InputMaybe<Scalars['Boolean']['input']>;
  isBackOfficeUser?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type EntityId = {
  id: Scalars['ID']['input'];
};

export type File = {
  __typename?: 'File';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
};

export type ManageUserGroupsInput = {
  userGroupIds: Array<Scalars['ID']['input']>;
  userId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateUser: SuccessResponse;
  assignUser: SuccessResponse;
  createAddress: Address;
  createOrganization: Organization;
  createUser: User;
  createUserGroup: UserGroup;
  deactivateUser: SuccessResponse;
  login: LoginResponse;
  manageUserGroups: SuccessResponse;
  removeAddress: SuccessResponse;
  removeUserGroup: SuccessResponse;
  resetPassword: SuccessResponse;
  updateAddress: Address;
  updateOrganization: Organization;
  updatePassword: User;
  updateUser: User;
  updateUserGroup: UserGroup;
};


export type MutationActivateUserArgs = {
  data: EntityId;
};


export type MutationAssignUserArgs = {
  data: AssignUserInput;
};


export type MutationCreateAddressArgs = {
  data: AddressInputWithPolymorphic;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationCreateUserGroupArgs = {
  data: CreateUserGroupInput;
};


export type MutationDeactivateUserArgs = {
  data: EntityId;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationManageUserGroupsArgs = {
  data: ManageUserGroupsInput;
};


export type MutationRemoveAddressArgs = {
  data: EntityId;
};


export type MutationRemoveUserGroupArgs = {
  data: EntityId;
};


export type MutationResetPasswordArgs = {
  data: EntityId;
};


export type MutationUpdateAddressArgs = {
  data: UpdateAddressInput;
};


export type MutationUpdateOrganizationArgs = {
  data: UpdateOrganizationInput;
};


export type MutationUpdatePasswordArgs = {
  data: UpdatePasswordInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};


export type MutationUpdateUserGroupArgs = {
  data: UpdateUserGroupInput;
};

export type Organization = {
  __typename?: 'Organization';
  addresses?: Maybe<Array<Address>>;
  avatar?: Maybe<File>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isArchived?: Maybe<Scalars['Boolean']['output']>;
  isIndependent?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  userGroups?: Maybe<Array<UserGroup>>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type OrganizationsResponse = {
  __typename?: 'OrganizationsResponse';
  organizations?: Maybe<Array<Organization>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  addresses: Array<Address>;
  me: User;
  organizations: OrganizationsResponse;
  userGroupUsers: UserGroupUserResponse;
  userGroups: Array<UserGroup>;
  users: UsersResponse;
};


export type QueryAddressesArgs = {
  addressableId: Scalars['String']['input'];
  addressableType: AddressableType;
};


export type QueryOrganizationsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserGroupUsersArgs = {
  keyword?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
  userGroupId: Scalars['ID']['input'];
};


export type QueryUserGroupsArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  success: Scalars['Boolean']['output'];
};

export type UpdateAddressInput = {
  attention?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  department?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
  zip: Scalars['String']['input'];
};

export type UpdateOrganizationInput = {
  avatarFileId?: InputMaybe<Scalars['ID']['input']>;
  avatarFileUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
};

export type UpdatePasswordInput = {
  id: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type UpdateUserGroupInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  permissions: Scalars['JSONObject']['input'];
};

export type UpdateUserInput = {
  avatarFileId?: InputMaybe<Scalars['ID']['input']>;
  avatarFileUrl?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  isApUser?: InputMaybe<Scalars['Boolean']['input']>;
  isBackOfficeUser?: InputMaybe<Scalars['Boolean']['input']>;
  isEmailVerified?: InputMaybe<Scalars['Boolean']['input']>;
  isSuperAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<File>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isApUser?: Maybe<Scalars['Boolean']['output']>;
  isBackOfficeUser?: Maybe<Scalars['Boolean']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  isSuperAdmin?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  userGroups?: Maybe<Array<UserGroup>>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organization?: Maybe<Organization>;
  parentId?: Maybe<Scalars['ID']['output']>;
  permissions: UserGroupPermission;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  users?: Maybe<Array<User>>;
};

export type UserGroupAssignee = {
  __typename?: 'UserGroupAssignee';
  avatar?: Maybe<File>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isApUser?: Maybe<Scalars['Boolean']['output']>;
  isBackOfficeUser?: Maybe<Scalars['Boolean']['output']>;
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  isSuperAdmin?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  userGroupId?: Maybe<Scalars['ID']['output']>;
  userGroupName?: Maybe<Scalars['String']['output']>;
  userGroups?: Maybe<Array<UserGroup>>;
};

export type UserGroupPermission = {
  __typename?: 'UserGroupPermission';
  Account: UserGroupRole;
  ApprovalAmount: Scalars['Float']['output'];
  BankAccount: UserGroupRole;
  BatchUpload: UserGroupRole;
  CreditCard: UserGroupRole;
  Customer: UserGroupRole;
  Report: UserGroupRole;
  Vendor: UserGroupRole;
};

/** User Group Role */
export enum UserGroupRole {
  Editor = 'Editor',
  None = 'None',
  Owner = 'Owner',
  Viewer = 'Viewer'
}

export type UserGroupUserResponse = {
  __typename?: 'UserGroupUserResponse';
  total?: Maybe<Scalars['Int']['output']>;
  users: Array<UserGroupAssignee>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  total?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type FetchMeQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string, avatar?: { __typename?: 'File', url: string } | null, userGroups?: Array<{ __typename?: 'UserGroup', id: string, name: string, organization?: { __typename?: 'Organization', id: string, name: string, slug: string, createdAt?: any | null, avatar?: { __typename?: 'File', url: string } | null } | null, permissions: { __typename?: 'UserGroupPermission', Account: UserGroupRole, ApprovalAmount: number, BankAccount: UserGroupRole, BatchUpload: UserGroupRole, CreditCard: UserGroupRole, Customer: UserGroupRole, Report: UserGroupRole, Vendor: UserGroupRole } }> | null } };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string } };


export const FetchMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Account"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"BankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"BatchUpload"}},{"kind":"Field","name":{"kind":"Name","value":"CreditCard"}},{"kind":"Field","name":{"kind":"Name","value":"Customer"}},{"kind":"Field","name":{"kind":"Name","value":"Report"}},{"kind":"Field","name":{"kind":"Name","value":"Vendor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchMeQuery, FetchMeQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;