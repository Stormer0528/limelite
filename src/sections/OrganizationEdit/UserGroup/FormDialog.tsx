import type { DialogProps } from '@mui/material/Dialog';
import type { UserGroup } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';

import { UserGroupRole } from '../types';
import RoleSelectField from './RoleSelectField';

// ----------------------------------------------------------------------

const CREATE_USER_GROUP = gql(/* GraphQL */ `
  mutation CreateUserGroup($data: CreateUserGroupInput!) {
    createUserGroup(data: $data) {
      name
      permissions {
        Account
        ApprovalAmount
        BankAccount
        BatchUpload
        CreditCard
        Customer
        Report
        Vendor
      }
    }
  }
`);

const UPDATE_USER_GROUP = gql(/* GraphQL */ `
  mutation UpdateUserGroup($data: UpdateUserGroupInput!) {
    updateUserGroup(data: $data) {
      name
      permissions {
        Account
        ApprovalAmount
        BankAccount
        BatchUpload
        CreditCard
        Customer
        Report
        Vendor
      }
    }
  }
`);

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  userGroup: UserGroup;
  organizationId: string;
  isAdding?: boolean;
  onClose: VoidFunction;
  onSuccess: VoidFunction;
}

// ----------------------------------------------------------------------
export type UserGroupSchemaType = zod.infer<typeof UserGroupSchema>;
const UserGroupRoleSchema = zod.nativeEnum(UserGroupRole);

const UserGroupSchema = zod.object({
  name: zod.string({ required_error: 'Name is required' }),
  permissions: zod.object(
    {
      Report: UserGroupRoleSchema,
      Vendor: UserGroupRoleSchema,
      Account: UserGroupRoleSchema,
      Customer: UserGroupRoleSchema,
      CreditCard: UserGroupRoleSchema,
      BankAccount: UserGroupRoleSchema,
      BatchUpload: UserGroupRoleSchema,
      ApprovalAmount: zod.number(),
    },
    { required_error: 'Permissions is required' }
  ),
});

const initialUserGroup = {
  name: '',
  permissions: {
    Report: UserGroupRole.None,
    Vendor: UserGroupRole.None,
    Account: UserGroupRole.None,
    Customer: UserGroupRole.None,
    CreditCard: UserGroupRole.None,
    BankAccount: UserGroupRole.None,
    BatchUpload: UserGroupRole.None,
    ApprovalAmount: 0,
  },
};

// ----------------------------------------------------------------------
export default function UserGroupFormDialog({
  onClose,
  onSuccess,
  userGroup,
  organizationId,
  isAdding,
  ...other
}: Props) {
  const [createUserGroup, { loading: isCreateLoading }] = useMutation(CREATE_USER_GROUP);
  const [updateUserGroup, { loading: isUpdateLoading }] = useMutation(UPDATE_USER_GROUP);

  const methods = useForm<UserGroupSchemaType>({
    resolver: zodResolver(UserGroupSchema),
    defaultValues: isAdding ? initialUserGroup : userGroup,
  });
  const { handleSubmit } = methods;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (newUserGroup) => {
    if (!isAdding && isEqual(userGroup, newUserGroup)) {
      toast.info('No changes to save');
      return;
    }

    if (isAdding) {
      await createUserGroup({
        variables: {
          data: {
            parentId: userGroup?.id!,
            organizationId,
            ...newUserGroup,
          },
        },
      });
      toast.success('Create success!');
      onSuccess();
    } else {
      await updateUserGroup({ variables: { data: { id: userGroup.id, ...newUserGroup } } });
      toast.success('Update success!');
      onSuccess();
    }
  });
  return (
    <Dialog maxWidth="sm" onClose={onClose} {...other}>
      <DialogTitle>{isAdding ? 'New group' : userGroup?.name}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset', minWidth: 400 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Field.Text name="name" label="Name" />
            <Field.Text name="permissions.ApprovalAmount" label="Approval Amount" />
          </Box>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <RoleSelectField name="permissions.Account" label="Account" />
            <RoleSelectField name="permissions.BankAccount" label="Bank Account" />
            <RoleSelectField name="permissions.BatchUpload" label="Batch Upload" />
            <RoleSelectField name="permissions.CreditCard" label="Credit Card" />
            <RoleSelectField name="permissions.Customer" label="Customer" />
            <RoleSelectField name="permissions.Report" label="Report" />
            <RoleSelectField name="permissions.Vendor" label="Vendor" />
          </Stack>

          <Stack alignItems="flex-end" sx={{ my: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isUpdateLoading || isCreateLoading}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
