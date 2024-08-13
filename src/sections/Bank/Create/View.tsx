import slugify from 'slugify';
import { z as zod } from 'zod';
import { useMemo, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useOrganizationContext } from 'src/libs/Organization';

import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';

import { useCreateBank } from './useApollo';
import { RHFAccountObjectSelect } from './RHFAccountObjectSelect';
// ----------------------------------------------------------------------

export type NewBankSchemaType = zod.infer<typeof NewBankSchema>;

export const NewBankSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required' }),
  accountObject: zod.object({
    id: zod.string().min(1, { message: 'Account Object is required' }),
    name: zod.string(),
  }),
  slug: zod.string().min(1, { message: 'Slug is required' }),
  startingBalance: zod.coerce.number({ invalid_type_error: 'Starting balance should be a number' }),
  description: zod.string().nullish(),

  bankName: zod.string().min(1, { message: 'Bank name is required' }),
  fractionalNumber: zod.string().nullish(),
  number: zod.string().min(1, { message: 'Bank Number is required' }),
  edpNumber: zod.string().nullish(),
  stateAccountNumber: zod.string().nullish(),
  pseudo: zod.string().nullish(),
  routingNumber: zod.string().nullish(),

  startedAt: zod.coerce.date({
    invalid_type_error: 'Start date should be a Date format',
    required_error: 'Start date is required',
  }),
  endedAt: zod.coerce
    .date({
      invalid_type_error: 'End date should be a Date format',
    })
    .nullish(),
});

// ----------------------------------------------------------------------

export function BankCreateView() {
  const { submitNewBank } = useCreateBank();
  const { organization } = useOrganizationContext();
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: '',
      slug: '',
      startingBalance: 0,
      bankName: '',
      number: '',
      startedAt: new Date(),
      endedAt: null,
    }),
    []
  );

  const methods = useForm<NewBankSchemaType>({
    resolver: zodResolver(NewBankSchema),
    defaultValues,
  });

  const {
    formState: { isSubmitting, touchedFields },
    control,
    handleSubmit,
    setValue,
    setError,
  } = methods;

  const name = useWatch({ control, name: 'name' });
  useEffect(() => {
    if (touchedFields.slug) {
      return;
    }
    setValue('slug', slugify(name, { lower: true }));
  }, [name, touchedFields, setValue]);

  const onSubmit = handleSubmit(async ({ accountObject, startingBalance, ...data }) => {
    try {
      await submitNewBank({
        ...data,
        accountObjectId: accountObject.id,
        startingBalanceInCents: startingBalance * 100,
        organizationId: organization?.id!,
      });
      toast.success(`Bank account created successfully!`);
      router.push(paths.organization.banks(organization?.slug!));
    } catch (error) {
      if (error instanceof ApolloError) {
        const [err] = error.graphQLErrors;
        if (err.path?.includes('slug')) {
          setError('slug', { type: 'manual', message: error?.message || '' });
        }
      } else {
        toast.error(error.message);
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader title="Properties" subheader="Bank account identification" sx={{ mb: 3 }} />

          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="name" label="Name" required />
              <Field.Text name="slug" label="Slug" required />
              <RHFAccountObjectSelect name="accountObject" label="Account object" />
              <Field.Text name="startingBalance" label="Starting balance" />
              <Field.DatePicker name="startedAt" label="Start date" />
              <Field.DatePicker name="endedAt" label="End date" />
            </Box>
            <Field.Text name="description" label="Description" multiline rows={4} />
          </Stack>
        </Card>

        <Card>
          <CardHeader title="Details" subheader="Bank account information" sx={{ mb: 3 }} />

          <Divider />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="bankName" label="Bank name" required />
              <Field.Text name="fractionalNumber" label="Fraction number" />
            </Box>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            >
              <Field.Text name="number" label="Bank account #" required />
              <Field.Text name="edpNumber" label="EDP #" />
              <Field.Text name="stateAccountNumber" label="State Acct. #" />
            </Box>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="pseudo" label="Pseudo" />
              <Field.Text name="routingNumber" label="Routing number" />
            </Box>
          </Stack>
        </Card>
        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="wrap"
        >
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            Create bank
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
