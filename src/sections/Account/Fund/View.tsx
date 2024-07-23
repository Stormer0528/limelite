import type { AccountFund } from 'src/__generated__/graphql';
import type {
  GridSlots,
  GridColDef,
  GridSortModel,
  GridColTypeDef,
  GridFilterModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useMemo, useState, useCallback } from 'react';

import {
  DataGrid,
  gridClasses,
  GridActionsCellItem,
  getGridNumericOperators,
} from '@mui/x-data-grid';

import { useQuery } from 'src/routes/hooks';

import { debounce } from 'src/utils/debounce';
import { parseFilter } from 'src/utils/parseFilter';

import { useOrganizationContext } from 'src/libs/Organization';

import { Iconify } from 'src/components/Iconify';
import { EmptyContent } from 'src/components/EmptyContent';
import { DataGridSkeleton, DataGridPagination } from 'src/components/DataGrid/';

import { FundFormModal } from './FundFormModal';
import { useFetchAccountFunds } from './useApollo';
import { FundRemoveModal } from './FundRemoveModal';
import { AccountFundTableToolBar } from './TableToolBar';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];
const numberColumnType: GridColTypeDef = {
  type: 'number',
  cellClassName: 'font-tabular-nums',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
  ),
};

export const AccountFundView = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>();
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [selectedFund, setSelectedFund] = useState<AccountFund | null | undefined>();
  const [removalFund, setRemovalFund] = useState<string | null | undefined>();

  const { organization } = useOrganizationContext();

  const [query, { setPage, setPageSize, setSort, setFilter }] = useQuery<GridFilterModel>();
  const { page = { page: 1, pageSize: 50 }, sort, filter } = query;

  const graphQueryFilter = useMemo(
    () => parseFilter({ organizationId: organization?.id }, filter),
    [filter, organization]
  );

  const graphQuerySort = useMemo(() => {
    if (!sort) return '-createdAt';

    return sort.map(({ field, sort: order }) => `${order === 'asc' ? '' : '-'}${field}`).join(',');
  }, [sort]);

  const { funds, rowCount, loading } = useFetchAccountFunds({
    filter: graphQueryFilter,
    page: page && `${page.page},${page.pageSize}`,
    sort: graphQuerySort,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'code',
        headerName: 'Fund Code',
        width: 200,
        ...numberColumnType,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
      },
      {
        type: 'actions',
        field: 'actions',
        headerName: ' ',
        align: 'right',
        headerAlign: 'right',
        width: 80,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<Iconify icon="solar:pen-bold" sx={{ fontSize: 'inherit' }} />}
            label="Edit"
            onClick={() => {
              // TODO: This is not fired every time.
              setSelectedFund(params.row as AccountFund);
            }}
          />,
          <GridActionsCellItem
            icon={<Iconify icon="solar:trash-bin-trash-bold" />}
            label="Delete"
            disabled={params.row.accountCount > 0}
            onClick={async () => {
              setRemovalFund(params.row.id);
            }}
            sx={{ color: 'error.main' }}
          />,
        ],
      },
    ],
    []
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((value) => {
      setFilter(value);
    }, 500),
    [setFilter]
  );

  const onFilterChange = useCallback(
    (filterModel: GridFilterModel) => {
      debouncedFilterChange(
        ['isEmpty', 'isNotEmpty'].includes(filterModel.items?.[0]?.operator) ||
          filterModel.items?.[0]?.value !== undefined
          ? filterModel
          : {}
      );
    },
    [debouncedFilterChange]
  );

  const onSortChange = useCallback(
    (newSortModel: GridSortModel) => {
      setSort(newSortModel);
    },
    [setSort]
  );

  const paginationModel = useMemo(() => ({ page: page.page - 1, pageSize: page.pageSize }), [page]);

  return (
    <>
      <DataGrid
        disableRowSelectionOnClick
        rows={funds}
        columns={columns}
        loading={loading}
        rowHeight={22}
        // Filter Props
        filterMode="server"
        onFilterModelChange={onFilterChange}
        initialState={{ filter: { filterModel: filter } }}
        // Sort Props
        sortModel={sort}
        onSortModelChange={onSortChange}
        // Pagination props
        rowCount={rowCount}
        paginationMode="server"
        pageSizeOptions={[10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={({ page: newPage, pageSize }) => {
          if (newPage + 1 !== page.page) {
            setPage(newPage + 1);
          }
          if (pageSize !== page.pageSize) {
            setPageSize(pageSize);
          }
        }}
        // Visibility props
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        slots={{
          toolbar: AccountFundTableToolBar as GridSlots['toolbar'],
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="No accounts found" />,
          pagination: DataGridPagination,
          loadingOverlay: DataGridSkeleton,
        }}
        slotProps={{
          panel: { anchorEl: filterButtonEl },
          toolbar: {
            setFilterButtonEl,
            onNewFundClick: () => {
              setSelectedFund(null);
            },
          },
          columnsManagement: { getTogglableColumns },
        }}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
      />
      <FundFormModal
        fund={selectedFund}
        open={selectedFund !== undefined}
        onClose={() => {
          setSelectedFund(undefined);
        }}
      />

      <FundRemoveModal
        fundId={removalFund ?? ''}
        open={!!removalFund}
        onClose={() => {
          setRemovalFund(null);
        }}
      />
    </>
  );
};
