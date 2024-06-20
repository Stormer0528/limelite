import type { UserGroup, Organization } from 'src/__generated__/graphql';

import { useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/SnackBar';

import { UserGroupNav } from './UserGroupNav';
import { useManageUserGroups } from './useApollo';
import { OrganizationNav } from './OrganizationNav';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  assignedUserGroups: UserGroup[];
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
};

// ----------------------------------------------------------------------

export function UserGroupAssign({ open, userId, assignedUserGroups, onClose, onSuccess }: Props) {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization>();
  const [selectedUserGroups, setSelectedUserGroups] = useState<UserGroup[]>(assignedUserGroups);

  const { manageUserGroups, loading } = useManageUserGroups();

  const assignedUserGroupIds = useMemo(
    () => assignedUserGroups.map((userGroup) => userGroup.id),
    [assignedUserGroups]
  );

  const selectedUserGroupsIds = useMemo(
    () => selectedUserGroups.map((userGroup) => userGroup.id),
    [selectedUserGroups]
  );

  const isUserGroupsChanged = useMemo(() => {
    if (assignedUserGroupIds.length !== selectedUserGroupsIds.length) {
      return true;
    }
    return !assignedUserGroupIds.every((id) => selectedUserGroupsIds.includes(id));
  }, [assignedUserGroupIds, selectedUserGroupsIds]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{ sx: { width: { sm: 1, md: 700 } } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6"> Manage organizations </Typography>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ px: 1, flexGrow: 1, overflow: 'hidden' }}>
        <Stack
          sx={{
            borderRadius: 1.5,
            flex: 1,
            overflow: 'hidden',
            bgcolor: 'background.default',
            py: 2,
          }}
        >
          <OrganizationNav
            selectedOrganization={selectedOrganization}
            onClickOrganization={(org) => {
              setSelectedOrganization(org);
            }}
            assignedUserGroups={selectedUserGroups}
          />
        </Stack>

        <Stack
          sx={{
            minWidth: 0,
            flex: 1,
            borderRadius: 1.5,
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          <UserGroupNav
            organization={selectedOrganization}
            assignedUserGroup={selectedUserGroups.find(
              (userGroup) => userGroup.organization?.id === selectedOrganization?.id
            )}
            onUserGroupChange={(newUserGroup) => {
              setSelectedUserGroups((prev) => [
                ...prev.filter((ug) => ug.organization?.id !== selectedOrganization?.id),
                newUserGroup,
              ]);
            }}
            onUserGroupRemove={(removeUserGroup) => {
              setSelectedUserGroups((prev) => prev.filter((ug) => ug.id !== removeUserGroup.id));
            }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="flex-end" sx={{ px: 1, py: 2 }}>
        <LoadingButton
          variant="contained"
          disabled={!isUserGroupsChanged}
          loading={loading}
          onClick={async () => {
            await manageUserGroups({ userId, userGroupIds: selectedUserGroupsIds });
            toast.success('Successfully updated');
            onSuccess();
          }}
        >
          Save changes
        </LoadingButton>
      </Stack>
    </Drawer>
  );
}
