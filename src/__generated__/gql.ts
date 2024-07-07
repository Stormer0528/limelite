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
    "\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatar {\n        url\n      }\n      userGroups {\n        id\n        name\n        organization {\n          id\n          name\n          slug\n          avatar {\n            url\n          }\n          createdAt\n        }\n        permissions {\n          Account\n          ApprovalAmount\n          BankAccount\n          BatchUpload\n          CreditCard\n          Customer\n          Report\n          Vendor\n        }\n      }\n    }\n  }\n": types.FetchMeDocument,
    "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n": types.LoginDocument,
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
export function gql(source: "\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatar {\n        url\n      }\n      userGroups {\n        id\n        name\n        organization {\n          id\n          name\n          slug\n          avatar {\n            url\n          }\n          createdAt\n        }\n        permissions {\n          Account\n          ApprovalAmount\n          BankAccount\n          BatchUpload\n          CreditCard\n          Customer\n          Report\n          Vendor\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchMe {\n    me {\n      id\n      name\n      email\n      avatar {\n        url\n      }\n      userGroups {\n        id\n        name\n        organization {\n          id\n          name\n          slug\n          avatar {\n            url\n          }\n          createdAt\n        }\n        permissions {\n          Account\n          ApprovalAmount\n          BankAccount\n          BatchUpload\n          CreditCard\n          Customer\n          Report\n          Vendor\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Login($data: LoginInput!) {\n    login(data: $data) {\n      accessToken\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;