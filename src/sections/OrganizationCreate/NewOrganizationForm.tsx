import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { uploadFile } from 'src/utils/uploadFile';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

const CREATE_ORGANIZATION = gql(/* GraphQL */ `
  mutation CreateOrganization($data: CreateOrganizationInput!) {
    createOrganization(data: $data) {
      id
      name
      slug
      addresses {
        id
      }
    }
  }
`);

// ----------------------------------------------------------------------
export type NewOrganizationSchemaType = zod.infer<typeof NewOrganizationSchema>;

const NewOrganizationSchema = zod.object({
  name: zod.string({ required_error: 'Name is required' }),
  slug: zod.string({ required_error: 'Slug is required' }),
  email: zod.string().email({ message: 'Email must be a valid email address' }).nullable(),
  phone: zod.string().nullable(),
  description: zod.string().nullable(),
  // TODO: Avatar url is nullable
  avatarUrl: zod.custom<File | string>().nullable(),
  addresses: zod
    .object({
      line1: zod.string({ required_error: 'Line1 is required' }),
      city: zod.string({ required_error: 'City is required' }),
      state: zod.string({ required_error: 'State is required' }),
      zip: zod.string({ required_error: 'Zip is required' }),
    })
    .array(),
});

export default function NewOrganizationForm() {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: '',
      slug: '',
      email: '',
      phone: '',
      description: '',
      addresses: [{ line1: '', city: '', state: '', zip: '' }],
      avatarUrl: null,
    }),
    []
  );

  const [submit, { loading }] = useMutation(CREATE_ORGANIZATION);

  const methods = useForm<NewOrganizationSchemaType>({
    resolver: zodResolver(NewOrganizationSchema),
    defaultValues,
  });

  const {
    fields,
    append: addAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: methods.control,
    name: 'addresses',
  });

  const { reset, setError, handleSubmit } = methods;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async ({ avatarUrl, ...data }) => {
    try {
      let newAvatarFileId; // File ID when user manually uploads avatar
      let newAvatarFileUrl; // File Url when user selects from default avatars
      if ((avatarUrl as unknown) instanceof File) {
        const uploadRes = await uploadFile(avatarUrl as unknown as File);
        newAvatarFileId = uploadRes.file.id;
      } else if (avatarUrl !== defaultValues.avatarUrl) {
        newAvatarFileUrl = avatarUrl as string;
      }

      await submit({
        variables: {
          data: {
            ...data,
            avatarFileId: newAvatarFileId,
            avatarFileUrl: newAvatarFileId ? undefined : newAvatarFileUrl,
          },
        },
      });
      reset();
      toast.success('Create success!');
      router.push(paths.dashboard.org.root);
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
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Addresses</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You can add multiple addresses
              </Typography>
            </Stack>
            {fields.map((item, index) => (
              <Grid container spacing={3} key={item.id}>
                <Grid xs={12}>
                  <Field.Text name={`addresses[${index}].name`} label="Address Name" required />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field.Text name={`addresses[${index}].attention`} label="Attention" />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field.Text name={`addresses[${index}].department`} label="Department" />
                </Grid>
                <Grid xs={12}>
                  <Field.Text name={`addresses[${index}].line1`} label="Line1" required />
                </Grid>
                <Grid xs={12}>
                  <Field.Text name={`addresses[${index}].line2`} label="Line2" />
                </Grid>
                <Grid xs={12} sm={4}>
                  <Field.Text name={`addresses[${index}].city`} label="City" required />
                </Grid>
                <Grid xs={12} sm={4}>
                  <Field.Text name={`addresses[${index}].state`} label="State" required />
                </Grid>
                <Grid xs={12} sm={4}>
                  <Field.Text name={`addresses[${index}].zip`} label="Zip" required />
                </Grid>
                <Grid xs={12} sx={{ textAlign: 'right' }}>
                  <Button
                    color="error"
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                    onClick={() => {
                      removeAddress(index);
                    }}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />
            <Button
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                addAddress({ line1: '', city: '', state: '', zip: '' });
              }}
              sx={{ flexShrink: 0 }}
            >
              Add address
            </Button>
          </Card>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Create Organization
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
