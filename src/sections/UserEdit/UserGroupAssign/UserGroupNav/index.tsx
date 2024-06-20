import type { UserGroup, Organization } from 'src/__generated__/graphql';

import { useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { LoadingScreen } from 'src/components/loading-screen';

import { useFetchUserGroups } from '../useApollo';

// ----------------------------------------------------------------------

type Props = {
  organization?: Organization;
  assignedUserGroup?: UserGroup;
  onUserGroupChange: (userGroup: UserGroup) => void;
  onUserGroupRemove: (userGroup: UserGroup) => void;
};

export function UserGroupNav({
  organization,
  assignedUserGroup,
  onUserGroupChange,
  onUserGroupRemove,
}: Props) {
  const { fetchUserGroups, data, loading } = useFetchUserGroups();
  useEffect(() => {
    if (organization) {
      fetchUserGroups(organization.id);
    }
  }, [organization, fetchUserGroups]);

  return (
    <Stack sx={{ py: 2 }}>
      <Stack direction="row" sx={{ px: 2 }}>
        {organization?.name}
      </Stack>
      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
      {loading ? (
        <LoadingScreen />
      ) : (
        <Stack sx={{ px: 2 }}>
          {data?.userGroups.map((userGroup) => (
            <FormControlLabel
              key={userGroup.id}
              checked={assignedUserGroup?.id === userGroup.id}
              control={<Checkbox />}
              label={userGroup.name}
              onChange={(_, checked) => {
                if (checked) {
                  onUserGroupChange({ ...userGroup, organization });
                } else if (assignedUserGroup?.id === userGroup.id) {
                  onUserGroupRemove(userGroup);
                }
              }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
