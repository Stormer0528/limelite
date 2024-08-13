import { useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ACCOUNT_OBJECTS = gql(/* GraphQL */ `
  query AccountObjects($filter: JSONObject, $page: String, $sort: String) {
    accountObjects(filter: $filter, page: $page, sort: $sort) {
      accountObjects {
        id
        name
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
export function useFetchAccountObjects({ filter, page, sort }: FetchAccountsArgs) {
  const { data, loading } = useQuery(FETCH_ACCOUNT_OBJECTS, {
    variables: { filter, page, sort },
    skip: !filter.organizationId,
  });

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.accountObjects.total ?? 0);

  const rowCount = useMemo(() => {
    const newTotal = data?.accountObjects.total ?? undefined;
    if (newTotal !== undefined) {
      rowCountRef.current = newTotal;
    }
    return rowCountRef.current;
  }, [data]);

  return {
    objects: data?.accountObjects.accountObjects ?? [],
    rowCount,
    loading,
  };
}
