import type { UpdateOrganizationInput } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

type Props = {
  currentOrg: UpdateOrganizationInput;
};

// ----------------------------------------------------------------------

const UPDATE_ORGANIZATION = gql(/* GraphQL */ `
  mutation UpdateOrganization($data: UpdateOrganizationInput!) {
    updateOrganization(data: $data) {
      id
      name
      slug
      email
      phone
      description
    }
  }
`);

// ----------------------------------------------------------------------
export type OrganizationGeneralSchemaType = zod.infer<typeof OrganizationGeneralSchema>;

const OrganizationGeneralSchema = zod.object({
  name: zod.string({ required_error: 'Name is required' }),
  slug: zod.string({ required_error: 'Slug is required' }),
  // TODO: Backend throws error when receive empty string for email
  email: zod.string().email({ message: 'Invalid email address is provided' }).nullable(),
  phone: zod.string().nullable(),
  description: zod.string().nullable(),
  avatarUrl: zod.string().nullable(),
});

export default function OrganizationGeneral({ currentOrg }: Props) {
  const [submit, { loading }] = useMutation(UPDATE_ORGANIZATION);

  const methods = useForm<OrganizationGeneralSchemaType>({
    resolver: zodResolver(OrganizationGeneralSchema),
    defaultValues: currentOrg,
  });

  const { reset, setError, handleSubmit } = methods;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (isEqual(data, currentOrg)) {
        toast.info('No changes to save');
        return;
      }

      await submit({ variables: { data: { ...data, id: currentOrg.id } } });
      reset();
      toast.success('Update success!');
    } catch (err) {
      if (err instanceof ApolloError) {
        const [error] = err.graphQLErrors;
        if (error.path?.includes('name')) {
          setError('name', { type: 'manual', message: error?.message || '' });
        }
        if (error.path?.includes('slug')) {
          setError('slug', { type: 'manual', message: error?.message || '' });
        }
      } else {
        toast.error(err.message);
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
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
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Organization Detail</Typography>
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
              <Field.Text name="name" label="Name" required />
              <Field.Text name="slug" label="Slug" required />

              <Field.Text
                name="email"
                label="Email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="line-md:email" />
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Text
                name="phone"
                label="Phone"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon="line-md:phone-call" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Field.Text name="description" label="Description" multiline rows={3} sx={{ mt: 3 }} />
          </Card>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
