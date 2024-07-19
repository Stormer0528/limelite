import type { DialogProps } from '@mui/material/Dialog';
import type { AccountFund } from 'src/__generated__/graphql';

import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useOrganizationContext } from 'src/libs/Organization';

import { toast } from 'src/components/SnackBar';
import { Form, Field } from 'src/components/Form';

import { useCreateAccountFunds, useUpdateAccountFunds } from './useApollo';
// ----------------------------------------------------------------------

type Props = DialogProps & {
  fund?: AccountFund | null;
  onClose: () => void;
};
// ----------------------------------------------------------------------

export type FundSchemaType = zod.infer<typeof FundSchema>;

export const FundSchema = zod.object({
  code: zod
    .string({ required_error: 'Code is required' })
    .regex(/^\d{4}$/, 'Code must be 4 digits'),
  name: zod.string({ required_error: 'Name is required' }).min(1, 'Name is required'),
});

// ----------------------------------------------------------------------

export function FundFormModal({ fund, onClose, open, ...other }: Props) {
  const { organization } = useOrganizationContext();
  const { submitFundCreate } = useCreateAccountFunds();
  const { submitFundUpdate } = useUpdateAccountFunds();

  const methods = useForm<FundSchemaType>({
    mode: 'all',
    resolver: zodResolver(FundSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (open) {
      const defaultValues = fund ? { code: fund.code!, name: fund.name! } : { code: '', name: '' };
      reset(defaultValues);
    }
  }, [reset, open, fund]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (fund) {
        await submitFundUpdate({
          variables: { data: { id: fund.id!, ...data } },
        });
        toast.success('Fund updated successfully');
      } else {
        await submitFundCreate({
          variables: { data: { ...data, organizationId: organization!.id } },
        });
        toast.success('Fund created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  });

  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} {...other}>
      <DialogTitle>{fund ? 'Update fund' : 'New fund'}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2.5}>
            <Field.Text label="Fund Code" name="code" required />
            <Field.Text label="Fund Name" name="name" required />
          </Stack>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          variant="contained"
          loading={isSubmitting}
          onClick={() => {
            onSubmit();
          }}
        >
          {fund ? 'Save' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
