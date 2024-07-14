import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { MaskInput } from 'src/components/MaskInput';

// ----------------------------------------------------------------------

export function AccountListSearchBar() {
  const handleFilterName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('@@@');
  }, []);

  return (
    <Stack
      flex={1}
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ pl: 2.5 }} // , pr: { xs: 2.5, md: 1 }
    >
      <TextField
        label="Name"
        // fullWidth
        value=""
        onChange={handleFilterName}
        placeholder="Search by name..."
        sx={{ flex: 1 }}
      />
      <MaskInput mask="0000" label="Fund" sx={{ width: 80 }} />
      <MaskInput mask="0000" label="Resource" sx={{ width: 100 }} />
      <MaskInput mask="0" label="Year" sx={{ width: 80 }} />
      <MaskInput mask="0000" label="Goal" sx={{ width: 80 }} />
      <MaskInput mask="0000" label="Function" sx={{ width: 100 }} />
      <MaskInput mask="0000" label="Object" sx={{ width: 80 }} />
      <MaskInput mask="0000" label="School" sx={{ width: 80 }} />
    </Stack>
  );
}
