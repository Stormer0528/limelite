import { useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ACCOUNT_FUNDS = gql(/* GraphQL */ `
  query AccountFunds($filter: JSONObject, $page: String, $sort: String) {
    accountFunds(filter: $filter, page: $page, sort: $sort) {
      accountFunds {
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
export function useFetchAccountFunds({ filter, page, sort }: FetchAccountsArgs) {
  const { data, loading } = useQuery(FETCH_ACCOUNT_FUNDS, {
    variables: { filter, page, sort },
    skip: !filter.organizationId,
  });

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.accountFunds.total ?? 0);

  const rowCount = useMemo(() => {
    const newTotal = data?.accountFunds.total ?? undefined;
    if (newTotal !== undefined) {
      rowCountRef.current = newTotal;
    }
    return rowCountRef.current;
  }, [data]);

  return {
    funds: data?.accountFunds.accountFunds ?? [],
    rowCount,
    loading,
  };
}
