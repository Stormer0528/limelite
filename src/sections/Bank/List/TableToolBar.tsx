import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/Iconify';

interface AccountTableToolBarProps {
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onNewBankClick: () => void;
}

export function AccountTableToolBar({
  setFilterButtonEl,
  onNewBankClick,
}: AccountTableToolBarProps) {
  const router = useRouter();

  return (
    <GridToolbarContainer>
      {/* <GridToolbarQuickFilter /> */}

      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        <Button
          variant="text"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          size="small"
          onClick={() => {
            router.push('new');
          }}
        >
          New bank
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton ref={setFilterButtonEl} />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}
