import type { UserGroup } from 'src/__generated__/graphql';

import { useMutation, useLazyQuery } from '@apollo/client';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { ConfirmDialog } from 'src/components/Dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { OrganizationalChart } from 'src/components/OrganizationalChart';

import { type UserGroupWithChildren } from 'src/sections/OrganizationEdit/types';

import UserGroupFormDialog from './FormDialog';
import UserGroupAssignDialog from './AssignDialog';

// ----------------------------------------------------------------------
const FETCH_USER_GROUPS = gql(/* GraphQL */ `
  query UserGroups($organizationId: ID!) {
    userGroups(organizationId: $organizationId) {
      id
      name
      parentId
      permissions {
        ApprovalAmount
        BankAccount
        BatchUpload
        Account
        Customer
        CreditCard
        Report
        Vendor
      }
      users {
        id
        name
        avatar {
          url
        }
        email
      }
    }
  }
`);

const REMOVE_USER_GROUP = gql(/* GraphQL */ `
  mutation RemoveUserGroup($data: EntityID!) {
    removeUserGroup(data: $data) {
      success
    }
  }
`);

// ----------------------------------------------------------------------

type Props = {
  orgId: string;
};

// ----------------------------------------------------------------------
export const createUserGroupTree = (userGroups: UserGroup[]): UserGroupWithChildren => {
  const map: Record<string, UserGroupWithChildren> = {};
  const userGroupsToProcess: UserGroup[] = [];
  let result: UserGroupWithChildren = {} as UserGroupWithChildren;

  userGroups.forEach((group) => {
    map[group.id] = { ...group, children: [] };
    if (group.parentId) {
      userGroupsToProcess.push(group);
    } else {
      result = map[group.id];
    }
  });

  userGroupsToProcess.forEach((group) => {
    map[group.parentId!].children.push(map[group.id]);
  });

  return result;
};

export default function OrganizationUserGroup({ orgId }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<UserGroup>();
  const [isAdding, setIsAdding] = useState(false);
  const [removeId, setRemoveId] = useState<string>();
  const [assignId, setAssignId] = useState<string>('');

  const [fetchUserGroupRequest, { data, loading }] = useLazyQuery(FETCH_USER_GROUPS);
  const [removeUserGroup, { loading: isRemoving }] = useMutation(REMOVE_USER_GROUP);

  const fetchUserGroup = useCallback(() => {
    fetchUserGroupRequest({ variables: { organizationId: orgId }, fetchPolicy: 'network-only' });
  }, [fetchUserGroupRequest, orgId]);

  useEffect(() => {
    fetchUserGroup();
  }, [fetchUserGroup]);

  const handleRemoveAddress = async (id: string) => {
    await removeUserGroup({
      variables: { data: { id } },
    });
    toast.success('Successfully removed');
    setRemoveId(undefined);
    fetchUserGroup();
  };

  const chartData = useMemo(() => {
    if (data?.userGroups) {
      return createUserGroupTree(data.userGroups);
    }
    return {
      name: 'Admin',
      permissions: {},
      children: [] as UserGroupWithChildren[],
    } as UserGroupWithChildren;
  }, [data]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <OrganizationalChart
        onAdd={(id: string) => {
          setSelectedGroup(data?.userGroups.find((group) => group.id === id));
          setIsAdding(true);
        }}
        onAssign={(id: string) => {
          setAssignId(id);
        }}
        onEdit={(id: string) => {
          setSelectedGroup(data?.userGroups.find((group) => group.id === id));
          setIsAdding(false);
        }}
        onRemove={(id: string) => {
          setRemoveId(id);
        }}
        data={chartData}
      />
      {selectedGroup && (
        <UserGroupFormDialog
          open
          organizationId={orgId}
          onClose={() => {
            setSelectedGroup(undefined);
          }}
          onSuccess={() => {
            setSelectedGroup(undefined);
            fetchUserGroup();
          }}
          userGroup={selectedGroup}
          isAdding={isAdding}
        />
      )}

      <UserGroupAssignDialog
        open={!!assignId}
        userGroupId={assignId}
        onClose={() => {
          setAssignId('');
          fetchUserGroup();
        }}
      />
      <ConfirmDialog
        open={!isRemoving && !!removeId}
        onClose={() => {
          setRemoveId(undefined);
        }}
        title="Removing user group?"
        content={
          <>
            Are you really going to remove this user group?
            <Typography variant="body2" color="error.main">
              Child user groups will be appended to the parent.
            </Typography>
            This action cannot be undone.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleRemoveAddress(removeId!);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
