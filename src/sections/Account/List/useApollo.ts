import { useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const FETCH_ACCOUNTS = gql(/* GraphQL */ `
  query Accounts($filter: JSONObject, $page: String, $sort: String) {
    accounts(filter: $filter, page: $page, sort: $sort) {
      accounts {
        id
        fund
        resource
        year
        goal
        function
        object
        location
        slug
        accountFunction {
          code
          name
        }
        accountFund {
          code
          name
        }
        accountGoal {
          code
          name
        }
        accountLocation {
          code
          name
        }
        accountObject {
          code
          name
        }
        accountResource {
          code
          name
        }
        accountYear {
          code
          name
        }
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------
interface FetchAccountsArgs {
  filter: any;
  page?: string;
  sort?: string;
}
export function useFetchAccounts({ filter, page, sort }: FetchAccountsArgs) {
  const { data, loading } = useQuery(FETCH_ACCOUNTS, {
    variables: { filter, page, sort },
    skip: !filter.organizationId,
  });

  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCount` from being undefined during the loading
  const rowCountRef = useRef(data?.accounts.total ?? 0);

  const rowCount = useMemo(() => {
    const newTotal = data?.accounts.total ?? undefined;
    if (newTotal !== undefined) {
      rowCountRef.current = newTotal;
    }
    return rowCountRef.current;
  }, [data]);

  return {
    accounts: data?.accounts.accounts ?? [],
    rowCount,
    loading,
  };
}
