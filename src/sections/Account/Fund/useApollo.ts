import { useRef, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';

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

const CREATE_ACCOUNT_FUND = gql(/* GraphQL */ `
  mutation CreateAccountFund($data: BaseCreateInput!) {
    createAccountFund(data: $data) {
      id
      name
      code
    }
  }
`);

const UPDATE_ACCOUNT_FUND = gql(/* GraphQL */ `
  mutation UpdateAccountFund($data: BaseUpdateInput!) {
    updateAccountFund(data: $data) {
      id
      name
      code
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

export function useCreateAccountFunds() {
  const [submitFundCreate, { error }] = useMutation(CREATE_ACCOUNT_FUND, {
    awaitRefetchQueries: true,
    refetchQueries: ['Organization'],
    update: (cache, { data }) => {
      cache.modify({
        fields: {
          accountFunds(funds) {
            const newFundRef = cache.writeFragment({
              data: data?.createAccountFund,
              fragment: gql(/* GraphQL */ `
                fragment NewFund on AccountFund {
                  id
                  name
                  code
                }
              `),
            });

            return {
              ...funds,
              accountFunds: [...funds.accountFunds, newFundRef],
              total: funds.total + 1,
            };
          },
        },
      });
    },
  });
  return { submitFundCreate, error };
}

export function useUpdateAccountFunds() {
  const [submitFundUpdate, { error }] = useMutation(UPDATE_ACCOUNT_FUND, {
    awaitRefetchQueries: true,
    refetchQueries: ['AccountFunds'],
  });
  return { submitFundUpdate, error };
}
