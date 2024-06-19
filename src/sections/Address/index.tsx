import type { Address, AddressableType } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';

// ----------------------------------------------------------------------

type Props = {
  addressableType: AddressableType;
  addressableId: string;
  address?: Address;
  onSuccess: VoidFunction;
};

// ----------------------------------------------------------------------

const UPDATE_ADDRESSES = gql(/* GraphQL */ `
  mutation UpdateAddress($data: UpdateAddressInput!) {
    updateAddress(data: $data) {
      id
      name
      attention
      department
      line1
      line2
      city
      state
      zip
    }
  }
`);

const CREATE_ADDRESSES = gql(/* GraphQL */ `
  mutation CreateAddress($data: AddressInputWithPolymorphic!) {
    createAddress(data: $data) {
      id
      name
      attention
      department
      line1
      line2
      city
      state
      zip
    }
  }
`);

// ----------------------------------------------------------------------

export type AddressSchemaType = zod.infer<typeof AddressSchema>;
const AddressSchema = zod.object({
  name: zod.string().nullable(),
  attention: zod.string().nullable(),
  department: zod.string().nullable(),
  line1: zod.string({ required_error: 'Line1 is required' }),
  city: zod.string({ required_error: 'City is required' }),
  state: zod.string({ required_error: 'State is required' }),
  zip: zod.string({ required_error: 'Zip is required' }),
});

export default function AddressForm({ addressableType, addressableId, address, onSuccess }: Props) {
  const [updateAddress, { loading: isUpdateLoading }] = useMutation(UPDATE_ADDRESSES);
  const [createAddress, { loading: isCreateLoading }] = useMutation(CREATE_ADDRESSES);

  const methods = useForm<AddressSchemaType>({
    resolver: zodResolver(AddressSchema),
    defaultValues: address,
  });
  const { handleSubmit } = methods;

  // TODO: Move to wrong validated field when validation field and tries to submit the form
  const onSubmit = handleSubmit(async (newAddress) => {
    if (isEqual(address, newAddress)) {
      toast.info('No changes to save');
      return;
    }
    if (address?.id) {
      await updateAddress({ variables: { data: { id: address.id, ...newAddress } } });
      toast.success('Update success!');
      onSuccess();
    } else {
      await createAddress({
        variables: {
          data: {
            ...newAddress,
            addressableType,
            addressableId,
          },
        },
      });
      toast.success('Create success!');
      onSuccess();
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Field.Text name="name" label="Address Name" />
        </Grid>
        <Grid xs={12} sm={6}>
          <Field.Text name="attention" label="Attention" />
        </Grid>
        <Grid xs={12} sm={6}>
          <Field.Text name="department" label="Department" />
        </Grid>
        <Grid xs={12}>
          <Field.Text name="line1" label="Line1" required />
        </Grid>
        <Grid xs={12}>
          <Field.Text name="line2" label="Line2" />
        </Grid>
        <Grid xs={12} sm={4}>
          <Field.Text name="city" label="City" required />
        </Grid>
        <Grid xs={12} sm={4}>
          <Field.Text name="state" label="State" required />
        </Grid>
        <Grid xs={12} sm={4}>
          <Field.Text name="zip" label="Zip" required />
        </Grid>
      </Grid>
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
  );
}
