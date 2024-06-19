/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n": types.FetchMeDocument,
    "\n  mutation UpdateAddress($data: UpdateAddressInput!) {\n    updateAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n": types.UpdateAddressDocument,
    "\n  mutation CreateAddress($data: AddressInputWithPolymorphic!) {\n    createAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n": types.CreateAddressDocument,
    "\n  mutation CreateOrganization($data: CreateOrganizationInput!) {\n    createOrganization(data: $data) {\n      id\n      name\n      slug\n      addresses {\n        id\n      }\n    }\n  }\n": types.CreateOrganizationDocument,
    "\n  query Addresses($addressableType: AddressableType!, $addressableId: String!) {\n    addresses(addressableType: $addressableType, addressableId: $addressableId) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n": types.AddressesDocument,
    "\n  mutation RemoveAddress($data: EntityID!) {\n    removeAddress(data: $data) {\n      success\n    }\n  }\n": types.RemoveAddressDocument,
    "\n  mutation UpdateOrganization($data: UpdateOrganizationInput!) {\n    updateOrganization(data: $data) {\n      id\n      name\n      slug\n      email\n      phone\n      description\n    }\n  }\n": types.UpdateOrganizationDocument,
    "\n  mutation AssignUser($data: AssignUserInput!) {\n    assignUser(data: $data) {\n      success\n    }\n  }\n": types.AssignUserDocument,
    "\n  query UserGroupUsers($userGroupId: ID!, $page: Int!, $pageSize: Int!, $keyword: String) {\n    userGroupUsers(userGroupId: $userGroupId, page: $page, pageSize: $pageSize, keyword: $keyword) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        status\n      }\n      total\n    }\n  }\n": types.UserGroupUsersDocument,
    "\n  mutation CreateUserGroup($data: CreateUserGroupInput!) {\n    createUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n": types.CreateUserGroupDocument,
    "\n  mutation UpdateUserGroup($data: UpdateUserGroupInput!) {\n    updateUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n": types.UpdateUserGroupDocument,
    "\n  query UserGroups($organizationId: ID!) {\n    userGroups(organizationId: $organizationId) {\n      id\n      name\n      parentId\n      permissions {\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        Account\n        Customer\n        CreditCard\n        Report\n        Vendor\n      }\n      users {\n        id\n        name\n        avatarUrl\n        email\n      }\n    }\n  }\n": types.UserGroupsDocument,
    "\n  mutation RemoveUserGroup($data: EntityID!) {\n    removeUserGroup(data: $data) {\n      success\n    }\n  }\n": types.RemoveUserGroupDocument,
    "\n  query FetchOrganization($filter: JSONObject) {\n    organizations(filter: $filter) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n": types.FetchOrganizationDocument,
    "\n  query FetchOrganizationsStats($activeFilter: JSONObject, $archivedFilter: JSONObject) {\n    all: organizations {\n      total\n    }\n    active: organizations(filter: $activeFilter) {\n      total\n    }\n    archived: organizations(filter: $archivedFilter) {\n      total\n    }\n  }\n": types.FetchOrganizationsStatsDocument,
    "\n  query FetchOrganizations($page: String, $filter: JSONObject, $sort: String) {\n    organizations(page: $page, filter: $filter, sort: $sort) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n        users {\n          id\n          name\n          email\n          avatarUrl\n        }\n      }\n      total\n    }\n  }\n": types.FetchOrganizationsDocument,
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n": types.LoginDocument,
    "\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isSuperAdmin\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      createdAt\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      isSuperAdmin\n    }\n  }\n": types.UpdateUserDocument,
    "\n  mutation ResetPassword($data: EntityID!) {\n    resetPassword(data: $data) {\n      success\n    }\n  }\n": types.ResetPasswordDocument,
    "\n  mutation DeactivateUser($data: EntityID!) {\n    deactivateUser(data: $data) {\n      success\n    }\n  }\n": types.DeactivateUserDocument,
    "\n  mutation ActivateUser($data: EntityID!) {\n    activateUser(data: $data) {\n      success\n    }\n  }\n": types.ActivateUserDocument,
    "\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        isBackOfficeUser\n        isEmailVerified\n        deletedAt\n        userGroups {\n          id\n          name\n          createdAt\n          permissions {\n            Account\n            ApprovalAmount\n            BankAccount\n            BatchUpload\n            CreditCard\n            Customer\n            Report\n            Vendor\n          }\n          organization {\n            id\n            name\n            slug\n            email\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n": types.FetchUserDocument,
    "\n  query FetchUserStats(\n    $adminFilter: JSONObject\n    $apFilter: JSONObject\n    $inactiveFilter: JSONObject\n  ) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n    inactive: users(filter: $inactiveFilter) {\n      total\n    }\n  }\n": types.FetchUserStatsDocument,
    "\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n": types.FetchUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n"): (typeof documents)["\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatarUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateAddress($data: UpdateAddressInput!) {\n    updateAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateAddress($data: UpdateAddressInput!) {\n    updateAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateAddress($data: AddressInputWithPolymorphic!) {\n    createAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAddress($data: AddressInputWithPolymorphic!) {\n    createAddress(data: $data) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateOrganization($data: CreateOrganizationInput!) {\n    createOrganization(data: $data) {\n      id\n      name\n      slug\n      addresses {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOrganization($data: CreateOrganizationInput!) {\n    createOrganization(data: $data) {\n      id\n      name\n      slug\n      addresses {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Addresses($addressableType: AddressableType!, $addressableId: String!) {\n    addresses(addressableType: $addressableType, addressableId: $addressableId) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"): (typeof documents)["\n  query Addresses($addressableType: AddressableType!, $addressableId: String!) {\n    addresses(addressableType: $addressableType, addressableId: $addressableId) {\n      id\n      name\n      attention\n      department\n      line1\n      line2\n      city\n      state\n      zip\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveAddress($data: EntityID!) {\n    removeAddress(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveAddress($data: EntityID!) {\n    removeAddress(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateOrganization($data: UpdateOrganizationInput!) {\n    updateOrganization(data: $data) {\n      id\n      name\n      slug\n      email\n      phone\n      description\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateOrganization($data: UpdateOrganizationInput!) {\n    updateOrganization(data: $data) {\n      id\n      name\n      slug\n      email\n      phone\n      description\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AssignUser($data: AssignUserInput!) {\n    assignUser(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation AssignUser($data: AssignUserInput!) {\n    assignUser(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserGroupUsers($userGroupId: ID!, $page: Int!, $pageSize: Int!, $keyword: String) {\n    userGroupUsers(userGroupId: $userGroupId, page: $page, pageSize: $pageSize, keyword: $keyword) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        status\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query UserGroupUsers($userGroupId: ID!, $page: Int!, $pageSize: Int!, $keyword: String) {\n    userGroupUsers(userGroupId: $userGroupId, page: $page, pageSize: $pageSize, keyword: $keyword) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        status\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUserGroup($data: CreateUserGroupInput!) {\n    createUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUserGroup($data: CreateUserGroupInput!) {\n    createUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateUserGroup($data: UpdateUserGroupInput!) {\n    updateUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserGroup($data: UpdateUserGroupInput!) {\n    updateUserGroup(data: $data) {\n      name\n      permissions {\n        Account\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        CreditCard\n        Customer\n        Report\n        Vendor\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserGroups($organizationId: ID!) {\n    userGroups(organizationId: $organizationId) {\n      id\n      name\n      parentId\n      permissions {\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        Account\n        Customer\n        CreditCard\n        Report\n        Vendor\n      }\n      users {\n        id\n        name\n        avatarUrl\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  query UserGroups($organizationId: ID!) {\n    userGroups(organizationId: $organizationId) {\n      id\n      name\n      parentId\n      permissions {\n        ApprovalAmount\n        BankAccount\n        BatchUpload\n        Account\n        Customer\n        CreditCard\n        Report\n        Vendor\n      }\n      users {\n        id\n        name\n        avatarUrl\n        email\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation RemoveUserGroup($data: EntityID!) {\n    removeUserGroup(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveUserGroup($data: EntityID!) {\n    removeUserGroup(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchOrganization($filter: JSONObject) {\n    organizations(filter: $filter) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchOrganization($filter: JSONObject) {\n    organizations(filter: $filter) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchOrganizationsStats($activeFilter: JSONObject, $archivedFilter: JSONObject) {\n    all: organizations {\n      total\n    }\n    active: organizations(filter: $activeFilter) {\n      total\n    }\n    archived: organizations(filter: $archivedFilter) {\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchOrganizationsStats($activeFilter: JSONObject, $archivedFilter: JSONObject) {\n    all: organizations {\n      total\n    }\n    active: organizations(filter: $activeFilter) {\n      total\n    }\n    archived: organizations(filter: $archivedFilter) {\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchOrganizations($page: String, $filter: JSONObject, $sort: String) {\n    organizations(page: $page, filter: $filter, sort: $sort) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n        users {\n          id\n          name\n          email\n          avatarUrl\n        }\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchOrganizations($page: String, $filter: JSONObject, $sort: String) {\n    organizations(page: $page, filter: $filter, sort: $sort) {\n      organizations {\n        id\n        name\n        slug\n        description\n        email\n        phone\n        avatarUrl\n        createdAt\n        updatedAt\n        deletedAt\n        users {\n          id\n          name\n          email\n          avatarUrl\n        }\n      }\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isSuperAdmin\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateUser($data: CreateUserInput!) {\n    createUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isSuperAdmin\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      createdAt\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      isSuperAdmin\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUser($data: UpdateUserInput!) {\n    updateUser(data: $data) {\n      id\n      name\n      email\n      avatarUrl\n      isApUser\n      isBackOfficeUser\n      isEmailVerified\n      isSuperAdmin\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ResetPassword($data: EntityID!) {\n    resetPassword(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ResetPassword($data: EntityID!) {\n    resetPassword(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeactivateUser($data: EntityID!) {\n    deactivateUser(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation DeactivateUser($data: EntityID!) {\n    deactivateUser(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ActivateUser($data: EntityID!) {\n    activateUser(data: $data) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation ActivateUser($data: EntityID!) {\n    activateUser(data: $data) {\n      success\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        isBackOfficeUser\n        isEmailVerified\n        deletedAt\n        userGroups {\n          id\n          name\n          createdAt\n          permissions {\n            Account\n            ApprovalAmount\n            BankAccount\n            BatchUpload\n            CreditCard\n            Customer\n            Report\n            Vendor\n          }\n          organization {\n            id\n            name\n            slug\n            email\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchUser($filter: JSONObject) {\n    users(filter: $filter) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        isBackOfficeUser\n        isEmailVerified\n        deletedAt\n        userGroups {\n          id\n          name\n          createdAt\n          permissions {\n            Account\n            ApprovalAmount\n            BankAccount\n            BatchUpload\n            CreditCard\n            Customer\n            Report\n            Vendor\n          }\n          organization {\n            id\n            name\n            slug\n            email\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUserStats(\n    $adminFilter: JSONObject\n    $apFilter: JSONObject\n    $inactiveFilter: JSONObject\n  ) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n    inactive: users(filter: $inactiveFilter) {\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchUserStats(\n    $adminFilter: JSONObject\n    $apFilter: JSONObject\n    $inactiveFilter: JSONObject\n  ) {\n    all: users {\n      total\n    }\n    admin: users(filter: $adminFilter) {\n      total\n    }\n    ap: users(filter: $apFilter) {\n      total\n    }\n    inactive: users(filter: $inactiveFilter) {\n      total\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n"): (typeof documents)["\n  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {\n    users(page: $page, filter: $filter, sort: $sort) {\n      users {\n        id\n        name\n        email\n        avatarUrl\n        isSuperAdmin\n        isApUser\n        createdAt\n        updatedAt\n        deletedAt\n      }\n      total\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;