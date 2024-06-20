import { useCallback } from 'react';
import { useMutation } from '@apollo/client';

import { gql } from 'src/__generated__/gql';
// ----------------------------------------------------------------------

const UNASSIGN_USER = gql(/* GraphQL */ `
  mutation AssignUser($data: AssignUserInput!) {
    assignUser(data: $data) {
      success
    }
  }
`);

// ----------------------------------------------------------------------

export function useUnassignUser() {
  const [submit, { error, loading }] = useMutation(UNASSIGN_USER);

  const unassignUser = useCallback(
    (data: { userId: string; userGroupId: string }) =>
      submit({
        variables: {
          data,
        },
      }),
    [submit]
  );

  return { unassignUser, error, loading };
}
