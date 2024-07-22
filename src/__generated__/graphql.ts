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

export type Account = {
  __typename?: 'Account';
  accountFunction?: Maybe<AccountFunction>;
  accountFund?: Maybe<AccountFund>;
  accountGoal?: Maybe<AccountGoal>;
  accountLocation?: Maybe<AccountLocation>;
  accountObject?: Maybe<AccountObject>;
  accountResource?: Maybe<AccountResource>;
  accountYear?: Maybe<AccountYear>;
  budgetCurrency?: Maybe<Scalars['String']['output']>;
  budgetInCents?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  function?: Maybe<Scalars['String']['output']>;
  fund?: Maybe<Scalars['String']['output']>;
  goal?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  object?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  resource?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  year?: Maybe<Scalars['String']['output']>;
};

export type AccountCreateInput = {
  accountFunctionId: Scalars['String']['input'];
  accountFundId: Scalars['String']['input'];
  accountGoalId: Scalars['String']['input'];
  accountLocationId: Scalars['String']['input'];
  accountObjectId: Scalars['String']['input'];
  accountResourceId: Scalars['String']['input'];
  accountYearId: Scalars['String']['input'];
  budgetCurrency?: InputMaybe<Scalars['String']['input']>;
  budgetInCents?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
};

export type AccountFunction = {
  __typename?: 'AccountFunction';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountFunctionsResponse = {
  __typename?: 'AccountFunctionsResponse';
  accountFunctions?: Maybe<Array<Maybe<AccountFunction>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountFund = {
  __typename?: 'AccountFund';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountFundsResponse = {
  __typename?: 'AccountFundsResponse';
  accountFunds?: Maybe<Array<Maybe<AccountFund>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountGoal = {
  __typename?: 'AccountGoal';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountGoalsResponse = {
  __typename?: 'AccountGoalsResponse';
  accountGoals?: Maybe<Array<Maybe<AccountGoal>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountLocation = {
  __typename?: 'AccountLocation';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountLocationsResponse = {
  __typename?: 'AccountLocationsResponse';
  accountLocations?: Maybe<Array<Maybe<AccountLocation>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountObject = {
  __typename?: 'AccountObject';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  normalBalance: NormalBalance;
  objectType: AccountObjectType;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountObjectCreateInput = {
  code: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  normalBalance: NormalBalance;
  objectType: AccountObjectType;
  organizationId: Scalars['String']['input'];
};

export enum AccountObjectType {
  Asset = 'Asset',
  Equity = 'Equity',
  Expense = 'Expense',
  Liability = 'Liability',
  Revenue = 'Revenue'
}

export type AccountObjectUpdateInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  normalBalance?: InputMaybe<NormalBalance>;
  objectType?: InputMaybe<AccountObjectType>;
};

export type AccountObjectsResponse = {
  __typename?: 'AccountObjectsResponse';
  accountObjects?: Maybe<Array<Maybe<AccountObject>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountResource = {
  __typename?: 'AccountResource';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isRestricted?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountResourcesResponse = {
  __typename?: 'AccountResourcesResponse';
  accountResources?: Maybe<Array<Maybe<AccountResource>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountUpdateInput = {
  accountFunctionId: Scalars['String']['input'];
  accountFundId: Scalars['String']['input'];
  accountGoalId: Scalars['String']['input'];
  accountLocationId: Scalars['String']['input'];
  accountObjectId: Scalars['String']['input'];
  accountResourceId: Scalars['String']['input'];
  accountYearId: Scalars['String']['input'];
  budgetCurrency?: InputMaybe<Scalars['String']['input']>;
  budgetInCents?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
};

export type AccountYear = {
  __typename?: 'AccountYear';
  accountCount?: Maybe<Scalars['Float']['output']>;
  accounts: Array<Account>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deletedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type AccountYearsResponse = {
  __typename?: 'AccountYearsResponse';
  accountYears?: Maybe<Array<Maybe<AccountYear>>>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type AccountsResponse = {
  __typename?: 'AccountsResponse';
  accounts?: Maybe<Array<Maybe<Account>>>;
  total?: Maybe<Scalars['Int']['output']>;
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

export type BaseCreateInput = {
  code: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type BaseUpdateInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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
  createAccount: Account;
  createAccountFunction: AccountFunction;
  createAccountFund: AccountFund;
  createAccountGoal: AccountGoal;
  createAccountLocation: AccountLocation;
  createAccountObject: AccountObject;
  createAccountResource: AccountResource;
  createAccountYear: AccountYear;
  createAddress: Address;
  createOrganization: Organization;
  createUser: User;
  createUserGroup: UserGroup;
  deactivateUser: SuccessResponse;
  login: LoginResponse;
  manageUserGroups: SuccessResponse;
  removeAccount: SuccessResponse;
  removeAccountFunction: SuccessResponse;
  removeAccountFund: SuccessResponse;
  removeAccountGoal: SuccessResponse;
  removeAccountLocation: SuccessResponse;
  removeAccountObject: SuccessResponse;
  removeAccountResource: SuccessResponse;
  removeAccountYear: SuccessResponse;
  removeAddress: SuccessResponse;
  removeUserGroup: SuccessResponse;
  resetPassword: SuccessResponse;
  updateAccount: Account;
  updateAccountFunction: AccountFunction;
  updateAccountFund: AccountFund;
  updateAccountGoal: AccountGoal;
  updateAccountLocation: AccountLocation;
  updateAccountObject: AccountObject;
  updateAccountResource: AccountResource;
  updateAccountYear: AccountYear;
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


export type MutationCreateAccountArgs = {
  data: AccountCreateInput;
};


export type MutationCreateAccountFunctionArgs = {
  data: BaseCreateInput;
};


export type MutationCreateAccountFundArgs = {
  data: BaseCreateInput;
};


export type MutationCreateAccountGoalArgs = {
  data: BaseCreateInput;
};


export type MutationCreateAccountLocationArgs = {
  data: BaseCreateInput;
};


export type MutationCreateAccountObjectArgs = {
  data: AccountObjectCreateInput;
};


export type MutationCreateAccountResourceArgs = {
  data: BaseCreateInput;
};


export type MutationCreateAccountYearArgs = {
  data: BaseCreateInput;
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


export type MutationRemoveAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountFunctionArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountFundArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountGoalArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountLocationArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountObjectArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountResourceArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveAccountYearArgs = {
  id: Scalars['String']['input'];
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


export type MutationUpdateAccountArgs = {
  data: AccountUpdateInput;
};


export type MutationUpdateAccountFunctionArgs = {
  data: BaseUpdateInput;
};


export type MutationUpdateAccountFundArgs = {
  data: BaseUpdateInput;
};


export type MutationUpdateAccountGoalArgs = {
  data: BaseUpdateInput;
};


export type MutationUpdateAccountLocationArgs = {
  data: BaseUpdateInput;
};


export type MutationUpdateAccountObjectArgs = {
  data: AccountObjectUpdateInput;
};


export type MutationUpdateAccountResourceArgs = {
  data: BaseUpdateInput;
};


export type MutationUpdateAccountYearArgs = {
  data: BaseUpdateInput;
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

/** Credit or Debit type of account object */
export enum NormalBalance {
  Credit = 'Credit',
  Debit = 'Debit'
}

export type Organization = {
  __typename?: 'Organization';
  accountStats?: Maybe<Scalars['JSONObject']['output']>;
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
  account?: Maybe<Account>;
  accountFunction?: Maybe<AccountFunction>;
  accountFunctions: AccountFunctionsResponse;
  accountFund?: Maybe<AccountFund>;
  accountFunds: AccountFundsResponse;
  accountGoal?: Maybe<AccountGoal>;
  accountGoals: AccountGoalsResponse;
  accountLocation?: Maybe<AccountLocation>;
  accountLocations: AccountLocationsResponse;
  accountObject?: Maybe<AccountObject>;
  accountObjects: AccountObjectsResponse;
  accountResource?: Maybe<AccountResource>;
  accountResources: AccountResourcesResponse;
  accountYear?: Maybe<AccountYear>;
  accountYears: AccountYearsResponse;
  accounts: AccountsResponse;
  addresses: Array<Address>;
  me: User;
  organization?: Maybe<Organization>;
  organizations: OrganizationsResponse;
  userGroupUsers: UserGroupUserResponse;
  userGroups: Array<UserGroup>;
  users: UsersResponse;
};


export type QueryAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountFunctionArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountFunctionsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountFundArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountFundsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountGoalArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountGoalsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountLocationArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountLocationsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountObjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountObjectsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountResourceArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountResourcesArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountYearArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccountYearsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAccountsArgs = {
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAddressesArgs = {
  addressableId: Scalars['String']['input'];
  addressableType: AddressableType;
};


export type QueryOrganizationArgs = {
  slug: Scalars['String']['input'];
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

export type OrganizationQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type OrganizationQuery = { __typename?: 'Query', organization?: { __typename?: 'Organization', id: string, name: string, slug: string, accountStats?: any | null } | null };

export type AccountFundsQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountFundsQuery = { __typename?: 'Query', accountFunds: { __typename?: 'AccountFundsResponse', total?: number | null, accountFunds?: Array<{ __typename?: 'AccountFund', id?: string | null, name?: string | null, code: string, accountCount?: number | null } | null> | null } };

export type CreateAccountFundMutationVariables = Exact<{
  data: BaseCreateInput;
}>;


export type CreateAccountFundMutation = { __typename?: 'Mutation', createAccountFund: { __typename?: 'AccountFund', id?: string | null, name?: string | null, code: string } };

export type UpdateAccountFundMutationVariables = Exact<{
  data: BaseUpdateInput;
}>;


export type UpdateAccountFundMutation = { __typename?: 'Mutation', updateAccountFund: { __typename?: 'AccountFund', id?: string | null, name?: string | null, code: string } };

export type RemoveAccountFundMutationVariables = Exact<{
  fundId: Scalars['String']['input'];
}>;


export type RemoveAccountFundMutation = { __typename?: 'Mutation', removeAccountFund: { __typename?: 'SuccessResponse', success: boolean } };

export type NewFundFragment = { __typename?: 'AccountFund', id?: string | null, name?: string | null, code: string } & { ' $fragmentName'?: 'NewFundFragment' };

export type AccountsQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountsQuery = { __typename?: 'Query', accounts: { __typename?: 'AccountsResponse', total?: number | null, accounts?: Array<{ __typename?: 'Account', id?: string | null, fund?: string | null, resource?: string | null, year?: string | null, goal?: string | null, function?: string | null, object?: string | null, location?: string | null, slug: string, accountFunction?: { __typename?: 'AccountFunction', code: string, name?: string | null } | null, accountFund?: { __typename?: 'AccountFund', code: string, name?: string | null } | null, accountGoal?: { __typename?: 'AccountGoal', code: string, name?: string | null } | null, accountLocation?: { __typename?: 'AccountLocation', code: string, name?: string | null } | null, accountObject?: { __typename?: 'AccountObject', code: string, name?: string | null } | null, accountResource?: { __typename?: 'AccountResource', code: string, name?: string | null } | null, accountYear?: { __typename?: 'AccountYear', code: string, name?: string | null } | null } | null> | null } };

export type AccountResourcesQueryVariables = Exact<{
  filter?: InputMaybe<Scalars['JSONObject']['input']>;
  page?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type AccountResourcesQuery = { __typename?: 'Query', accountResources: { __typename?: 'AccountResourcesResponse', total?: number | null, accountResources?: Array<{ __typename?: 'AccountResource', id?: string | null, name?: string | null, isRestricted?: boolean | null, code: string } | null> | null } };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string } };

export const NewFundFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewFund"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccountFund"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]} as unknown as DocumentNode<NewFundFragment, unknown>;
export const FetchMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Account"}},{"kind":"Field","name":{"kind":"Name","value":"ApprovalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"BankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"BatchUpload"}},{"kind":"Field","name":{"kind":"Name","value":"CreditCard"}},{"kind":"Field","name":{"kind":"Name","value":"Customer"}},{"kind":"Field","name":{"kind":"Name","value":"Report"}},{"kind":"Field","name":{"kind":"Name","value":"Vendor"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchMeQuery, FetchMeQueryVariables>;
export const OrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Organization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"accountStats"}}]}}]}}]} as unknown as DocumentNode<OrganizationQuery, OrganizationQueryVariables>;
export const AccountFundsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountFunds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountFunds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountFunds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"accountCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AccountFundsQuery, AccountFundsQueryVariables>;
export const CreateAccountFundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccountFund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseCreateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccountFund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CreateAccountFundMutation, CreateAccountFundMutationVariables>;
export const UpdateAccountFundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccountFund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BaseUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccountFund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<UpdateAccountFundMutation, UpdateAccountFundMutationVariables>;
export const RemoveAccountFundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveAccountFund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fundId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAccountFund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fundId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveAccountFundMutation, RemoveAccountFundMutationVariables>;
export const AccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Accounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fund"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"goal"}},{"kind":"Field","name":{"kind":"Name","value":"function"}},{"kind":"Field","name":{"kind":"Name","value":"object"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"accountFunction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountFund"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountGoal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountLocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountResource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accountYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AccountsQuery, AccountsQueryVariables>;
export const AccountResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AccountResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accountResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isRestricted"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<AccountResourcesQuery, AccountResourcesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;