import type { DialogProps } from '@mui/material/Dialog';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/SnackBar';

import { useRemoveAccountFunds } from './useApollo';
// ----------------------------------------------------------------------

type Props = DialogProps & {
  fundId?: string;
  onClose: () => void;
};

// ----------------------------------------------------------------------

export function FundRemoveModal({ fundId, onClose, ...other }: Props) {
  const { submitFundRemove, loading } = useRemoveAccountFunds();

  const onConfirm = async () => {
    try {
      if (fundId) {
        await submitFundRemove({
          variables: { fundId },
        });
        toast.success('Fund removed successfully');

        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth onClose={onClose} {...other}>
      <DialogTitle>Are you sure?</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        Do you really want to remove it? It is irreversible.
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton
          variant="contained"
          color="error"
          loading={loading}
          onClick={() => {
            onConfirm();
          }}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
