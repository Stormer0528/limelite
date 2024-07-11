import type { Organization } from 'src/__generated__/graphql';

import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ORGANIZATION = gql(/* GraphQL */ `
  query Organization($filter: JSONObject) {
    organizations(filter: $filter) {
      organizations {
        id
        name
        slug
        accountStats
      }
    }
  }
`);

// ----------------------------------------------------------------------

export function useFetchOrganization(slug: string) {
  const { data, loading } = useQuery(FETCH_ORGANIZATION, {
    variables: { filter: { slug } },
  });

  return { organization: data?.organizations.organizations?.[0] ?? ({} as Organization), loading };
}
