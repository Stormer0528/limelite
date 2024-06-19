import type { User } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useBoolean } from 'src/hooks/useBoolean';

import { fDateTime } from 'src/utils/format-time';

import { gql } from 'src/__generated__/gql';

import { Label } from 'src/components/Label';
import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';
import { ConfirmDialog } from 'src/components/Dialog';

// ----------------------------------------------------------------------

type Props = {
  currentUser: User;
  refetchUser: VoidFunction;
};

// ----------------------------------------------------------------------

const UPDATE_USER = gql(/* GraphQL */ `
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      name
      email
      avatarUrl
      isApUser
      isBackOfficeUser
      isEmailVerified
      isSuperAdmin
    }
  }
`);

const RESET_PASSWORD = gql(/* GraphQL */ `
  mutation ResetPassword($data: EntityID!) {
    resetPassword(data: $data) {
      success
    }
  }
`);

const DEACTIVATE_USER = gql(/* GraphQL */ `
  mutation DeactivateUser($data: EntityID!) {
    deactivateUser(data: $data) {
      success
    }
  }
`);

const ACTIVATE_USER = gql(/* GraphQL */ `
  mutation ActivateUser($data: EntityID!) {
    activateUser(data: $data) {
      success
    }
  }
`);

// ----------------------------------------------------------------------
export type UserGeneralSchemaType = zod.infer<typeof UserGeneralSchema>;

const UserGeneralSchema = zod.object({
  name: zod.string({ required_error: 'Name is required' }),
  email: zod
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address is provided' }),
  avatarUrl: zod.string().nullable(),
  isSuperAdmin: zod.boolean().nullable(),
  isApUser: zod.boolean().nullable(),
  isBackOfficeUser: zod.boolean().nullable(),
  isEmailVerified: zod.boolean().nullable(),
});

export default function UserGeneral({ currentUser, refetchUser }: Props) {
  const passwordConfirm = useBoolean();
  const deactivateConfirm = useBoolean();

  const [submit, { loading }] = useMutation(UPDATE_USER);
  const [resetPasswordMutation, { loading: isResettingPassword }] = useMutation(RESET_PASSWORD);
  const [deactivateUserMutation, { loading: isDeactivating }] = useMutation(DEACTIVATE_USER);
  const [activateUserMutation, { loading: isActivating }] = useMutation(ACTIVATE_USER);

  const methods = useForm({
    resolver: zodResolver(UserGeneralSchema),
    defaultValues: currentUser,
  });

  const { setError, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (newUser) => {
    try {
      if (isEqual(newUser, currentUser)) {
        toast.warning('No changes to save');
        return;
      }

      // Need to strip fields
      // const data = await userSchema.validate(newUser, { stripUnknown: true });
      await submit({ variables: { data: { ...newUser, id: currentUser.id } } });
      toast.success('Update success!');
    } catch (err) {
      if (err instanceof ApolloError) {
        const [error] = err.graphQLErrors;
        if (error.path?.includes('email')) {
          setError('email', { type: 'manual', message: error?.message || '' });
        }
      }
      toast.error(err.message);
    }
  });

  const resetPassword = useCallback(
    async (id: string) => {
      passwordConfirm.onFalse();
      await resetPasswordMutation({ variables: { data: { id } } });
      toast.success('Reset password success!');
    },
    [resetPasswordMutation, passwordConfirm]
  );

  const deactivateUser = useCallback(
    async (id: string) => {
      deactivateConfirm.onFalse();
      await deactivateUserMutation({ variables: { data: { id } } });
      await refetchUser();
      toast.success('Deactivate success!');
    },
    [deactivateUserMutation, deactivateConfirm, refetchUser]
  );
  const activateUser = useCallback(
    async (id: string) => {
      await activateUserMutation({ variables: { data: { id } } });
      await refetchUser();
      toast.success('Activate success!');
    },
    [activateUserMutation, refetchUser]
  );

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              {currentUser.deletedAt && (
                <Tooltip
                  title={`Deactivated at ${fDateTime(currentUser.deletedAt)}`}
                  placement="top"
                  arrow
                >
                  <Label color="warning" sx={{ position: 'absolute', top: 24, right: 24 }}>
                    Inactive
                  </Label>
                </Tooltip>
              )}
              <Box sx={{ mb: 5 }}>
                <Field.SelectAvatar
                  name="avatarUrl"
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.disabled',
                      }}
                    >
                      Select your favorite avatar <br /> among 25 gorgeous avatars
                    </Typography>
                  }
                />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 3 }}
              >
                <LoadingButton
                  color="primary"
                  variant="soft"
                  loading={isResettingPassword}
                  onClick={passwordConfirm.onTrue}
                >
                  Reset Password
                </LoadingButton>
                {currentUser.deletedAt ? (
                  <LoadingButton
                    color="primary"
                    variant="soft"
                    loading={isActivating}
                    onClick={() => {
                      activateUser(currentUser.id);
                    }}
                  >
                    Activate account
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    color="error"
                    variant="soft"
                    loading={isDeactivating}
                    onClick={deactivateConfirm.onTrue}
                  >
                    Deactivate account
                  </LoadingButton>
                )}
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={1} sx={{ mb: 3 }}>
                <Typography variant="subtitle2">Personal Information</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Personal information here.
                </Typography>
              </Stack>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Text name="name" label="Full Name" />
                <Field.Text name="email" label="Email Address" />

                <Field.Switch
                  name="isSuperAdmin"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Admin
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Admin permission
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
                />

                <Field.Switch
                  name="isApUser"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        AP User
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        AP user can access to all organizations upload platform
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
                />

                <Field.Switch
                  name="isBackOfficeUser"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Back Office User
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Back office user is a user from ICON school management
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
                />

                <Field.Switch
                  name="isEmailVerified"
                  labelPlacement="start"
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Email Verified
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Enabling this will NOT automatically send a verification email
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={loading}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>

      <ConfirmDialog
        open={deactivateConfirm.value}
        onClose={deactivateConfirm.onFalse}
        title="Deactivate user?"
        content={
          <>
            This will deactivate the user account and unassign from all organizations. <br />
            User will no longer be able to access the application.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deactivateUser(currentUser.id);
            }}
          >
            Confirm
          </Button>
        }
      />

      <ConfirmDialog
        open={passwordConfirm.value}
        onClose={passwordConfirm.onFalse}
        title="Reset password?"
        content={
          <>
            This will reset the password and send reset password email to the user. Original
            password will be no longer available.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              resetPassword(currentUser.id);
            }}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
}
