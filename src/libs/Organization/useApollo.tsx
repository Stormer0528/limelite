import type { Organization } from 'src/__generated__/graphql';

import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ORGANIZATION = gql(/* GraphQL */ `
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      accountStats
    }
  }
`);

// ----------------------------------------------------------------------

export function useFetchOrganization(slug: string) {
  const { data, loading } = useQuery(FETCH_ORGANIZATION, {
    variables: { slug },
  });

  // TODO: If the organization is not found, redirect to 404 page
  return { organization: data?.organization ?? ({} as Organization), loading };
}
