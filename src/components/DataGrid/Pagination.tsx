import type { TablePaginationProps } from '@mui/material/TablePagination';

import MuiPagination from '@mui/material/Pagination';
import {
  GridPagination,
  useGridSelector,
  useGridApiContext,
  gridPageCountSelector,
} from '@mui/x-data-grid';

function CustomPagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

export function DataGridPagination(props: any) {
  return <GridPagination ActionsComponent={CustomPagination} {...props} />;
}
