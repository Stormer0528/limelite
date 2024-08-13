import type { CreateBankAccountInput } from 'src/__generated__/graphql';

import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const CREATE_BANK = gql(/* GraphQL */ `
  mutation CreateBankAccount($data: CreateBankAccountInput!) {
    createBankAccount(data: $data) {
      id
    }
  }
`);

// ----------------------------------------------------------------------

export function useCreateBank() {
  const [callMutation, { error }] = useMutation(CREATE_BANK);

  const submitNewBank = useCallback(
    (data: CreateBankAccountInput) => callMutation({ variables: { data } }),
    [callMutation]
  );

  return { submitNewBank, error };
}
