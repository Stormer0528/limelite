import { useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const SEARCH_ORGANIZATION = gql(/* GraphQL */ `
  query SearchOrganizations($filter: JSONObject, $page: String, $sort: String) {
    organizations(filter: $filter, page: $page, sort: $sort) {
      organizations {
        id
        name
        slug
      }
      total
    }
  }
`);

const FETCH_USER_GROUPS = gql(/* GraphQL */ `
  query UserGroups($organizationId: ID!) {
    userGroups(organizationId: $organizationId) {
      id
      name
      parentId
      permissions {
        ApprovalAmount
        BankAccount
        BatchUpload
        Account
        Customer
        CreditCard
        Report
        Vendor
      }
      users {
        id
        name
        avatarUrl
        email
      }
    }
  }
`);

const MANAGE_USER_GROUPS = gql(/* GraphQL */ `
  mutation ManageUserGroups($data: ManageUserGroupsInput!) {
    manageUserGroups(data: $data) {
      success
    }
  }
`);

// ----------------------------------------------------------------------

export function useSearchOrganizations() {
  const [fetchQuery, { error, data, loading }] = useLazyQuery(SEARCH_ORGANIZATION);

  const searchOrganizations = useCallback(
    ({ keyword, page }: { keyword: string; page: number }) =>
      fetchQuery({
        variables: {
          filter: {
            name: { contains: keyword },
            deletedAt: null,
          },
          page: `${page},20`,
          sort: '-name',
        },
      }),
    [fetchQuery]
  );

  return { searchOrganizations, error, data, loading };
}

export function useFetchUserGroups() {
  const [fetchQuery, { error, data, loading }] = useLazyQuery(FETCH_USER_GROUPS);

  const fetchUserGroups = useCallback(
    (organizationId: string) =>
      fetchQuery({
        variables: {
          organizationId,
        },
      }),
    [fetchQuery]
  );

  return { fetchUserGroups, error, data, loading };
}

export function useManageUserGroups() {
  const [submit, { error, loading }] = useMutation(MANAGE_USER_GROUPS);

  const manageUserGroups = useCallback(
    (data: { userId: string; userGroupIds: string[] }) =>
      submit({
        variables: {
          data,
        },
      }),
    [submit]
  );

  return { manageUserGroups, error, loading };
}
