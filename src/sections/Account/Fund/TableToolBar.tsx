import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { Iconify } from 'src/components/Iconify';

interface AccountTableToolBarProps {
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onNewFundClick: () => void;
}

export function AccountFundTableToolBar({
  setFilterButtonEl,
  onNewFundClick,
}: AccountTableToolBarProps) {
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
            onNewFundClick();
          }}
        >
          New fund
        </Button>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton ref={setFilterButtonEl} />
        <GridToolbarExport />
      </Stack>
    </GridToolbarContainer>
  );
}
