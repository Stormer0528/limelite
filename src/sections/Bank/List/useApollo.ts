import { useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_BANKS = gql(/* GraphQL */ `
  query BankAccounts($filter: JSONObject, $page: String, $sort: String) {
    bankAccounts(filter: $filter, page: $page, sort: $sort) {
      bankAccounts {
        id
        name
        number
        accountObject {
          name
          code
        }
        description
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------
interface FetchArgs {
  filter?: any;
  page?: string;
  sort?: string;
}
export function useFetchBanks({ filter, page, sort }: FetchArgs) {
  const { data, loading } = useQuery(FETCH_BANKS, {
    variables: { filter, page, sort },
    skip: !filter.organizationId,
  });

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.bankAccounts.total ?? 0);

  const rowCount = useMemo(() => {
    const newTotal = data?.bankAccounts.total ?? undefined;
    if (newTotal !== undefined) {
      rowCountRef.current = newTotal;
    }
    return rowCountRef.current;
  }, [data]);

  return {
    accounts: data?.bankAccounts.bankAccounts ?? [],
    rowCount,
    loading,
  };
}
