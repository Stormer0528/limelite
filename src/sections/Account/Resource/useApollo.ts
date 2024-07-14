import { useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ACCOUNT_RESOURCES = gql(/* GraphQL */ `
  query AccountResources($filter: JSONObject, $page: String, $sort: String) {
    accountResources(filter: $filter, page: $page, sort: $sort) {
      accountResources {
        id
        name
        isRestricted
        code
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------
interface FetchAccountsArgs {
  filter?: any;
  page?: string;
  sort?: string;
}
export function useFetchAccountResources({ filter, page, sort }: FetchAccountsArgs) {
  const { data, loading } = useQuery(FETCH_ACCOUNT_RESOURCES, {
    variables: { filter, page, sort },
    skip: !filter.organizationId,
  });

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.accountResources.total ?? 0);

  const rowCount = useMemo(() => {
    const newTotal = data?.accountResources.total ?? undefined;
    if (newTotal !== undefined) {
      rowCountRef.current = newTotal;
    }
    return rowCountRef.current;
  }, [data]);

  return {
    funds: data?.accountResources.accountResources ?? [],
    rowCount,
    loading,
  };
}
