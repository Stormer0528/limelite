import type { Address, AddressableType } from 'src/__generated__/graphql';

import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';
import { ConfirmDialog } from 'src/components/Dialog';
import { LoadingScreen } from 'src/components/loading-screen';

import AddressEditDialog from './EditDialog';

// ----------------------------------------------------------------------

type Props = {
  addressableType: AddressableType;
  addressableId: string;
};

// ----------------------------------------------------------------------

const FETCH_ADDRESSES = gql(/* GraphQL */ `
  query Addresses($addressableType: AddressableType!, $addressableId: String!) {
    addresses(addressableType: $addressableType, addressableId: $addressableId) {
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

const REMOVE_ADDRESS = gql(/* GraphQL */ `
  mutation RemoveAddress($data: EntityID!) {
    removeAddress(data: $data) {
      success
    }
  }
`);
// ----------------------------------------------------------------------

export default function OrganizationAddress({ addressableType, addressableId }: Props) {
  const [currentAddress, setCurrentAddress] = useState<Address>();
  const [removeId, setRemoveId] = useState<string>();

  const [removeAddress, { loading: isRemoving }] = useMutation(REMOVE_ADDRESS);

  const [fetchAddresses, { data, loading }] = useLazyQuery(FETCH_ADDRESSES);

  useEffect(() => {
    fetchAddresses({
      variables: { addressableId, addressableType },
    });
  }, [fetchAddresses, addressableId, addressableType]);

  const handleRemoveAddress = async (id: string) => {
    await removeAddress({
      variables: { data: { id } },
    });
    toast.success('Successfully removed');
    setRemoveId(undefined);
    fetchAddresses({
      variables: { addressableId, addressableType },
      fetchPolicy: 'network-only',
    });
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Grid container spacing={3}>
        {data?.addresses.map((address) => (
          <Grid sm={6} md={4} key={address.id}>
            <Card
              sx={{
                position: 'relative',
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows.z8,
                  '& .address-actions': {
                    opacity: 1,
                  },
                },
              }}
            >
              {removeId === address.id && isRemoving && (
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: (theme) => theme.palette.background.paper,
                    opacity: 0.7,
                  }}
                >
                  <LoadingScreen />
                </Box>
              )}

              <Stack sx={{ p: 3, pb: 2 }}>
                <Stack
                  direction="row"
                  className="address-actions"
                  sx={{
                    opacity: 0,
                    top: 22,
                    right: 24,
                    position: 'absolute',
                    transition: (theme) =>
                      theme.transitions.create(['opacity'], {
                        duration: theme.transitions.duration.shorter,
                      }),
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setCurrentAddress(address);
                    }}
                  >
                    <Iconify icon="solar:pen-bold" width={16} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setRemoveId(address.id);
                    }}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Stack>
                <Typography variant="subtitle1">{address.name || 'No name'}</Typography>
                <Stack spacing={1.5} sx={{ pt: 2, typography: 'body2' }}>
                  <Stack direction="row">
                    <Box
                      component="span"
                      sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
                    >
                      Attention
                    </Box>
                    {address.attention || (
                      <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        Not specified
                      </Box>
                    )}
                  </Stack>
                  <Stack direction="row">
                    <Box
                      component="span"
                      sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}
                    >
                      Department
                    </Box>
                    {address.department || (
                      <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                        Not specified
                      </Box>
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                <Stack direction="row" alignItems="center">
                  {address.line1}
                </Stack>
                {address.line2 && (
                  <Stack direction="row" alignItems="center">
                    {address.line2}
                  </Stack>
                )}
                <Stack direction="row" alignItems="center">
                  {address.city}, {address.state}, {address.zip}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
        <Grid sm={6} md={4}>
          <Card
            sx={{
              minHeight: 200,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z8,
              },
            }}
            onClick={() => {
              setCurrentAddress({} as Address);
            }}
          >
            <Iconify width={48} icon="quill:add" />
          </Card>
        </Grid>
      </Grid>
      <AddressEditDialog
        open={!!currentAddress}
        address={currentAddress}
        addressableId={addressableId}
        addressableType={addressableType}
        onClose={() => {
          setCurrentAddress(undefined);
        }}
        onSuccess={() => {
          setCurrentAddress(undefined);
          fetchAddresses({
            variables: { addressableId, addressableType },
            fetchPolicy: 'network-only',
          });
        }}
      />
      <ConfirmDialog
        open={!isRemoving && !!removeId}
        onClose={() => {
          setRemoveId(undefined);
        }}
        title="Removing address?"
        content="Are you really going to remove this address? This action cannot be undone."
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
