import type {
  GridSlots,
  GridColDef,
  GridSortModel,
  GridColTypeDef,
  GridFilterModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useMemo, useState, useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
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

import { useFetchAccounts } from './useApollo';
import { AccountTableToolBar } from './TableToolBar';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];
const numberColumnType: GridColTypeDef = {
  type: 'number',
  cellClassName: 'font-tabular-nums',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
  ),
};

export const AccountListView = () => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>();
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const { organization } = useOrganizationContext();

  const [query, { setPage, setPageSize, setSort, setFilter }] = useQuery<GridFilterModel>();
  const { page = { page: 1, pageSize: 50 }, sort, filter } = query;

  const graphQueryFilter = useMemo(
    () => parseFilter({ organizationId: organization?.id }, filter),
    [filter, organization]
  );

  const graphQuerySort = useMemo(() => {
    if (!sort) return undefined;

    return sort.map(({ field, sort: order }) => `${order === 'asc' ? '' : '-'}${field}`).join(',');
  }, [sort]);

  const { accounts, rowCount, loading } = useFetchAccounts({
    filter: graphQueryFilter,
    page: page && `${page.page},${page.pageSize}`,
    sort: graphQuerySort,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'fund',
        headerName: 'Fund',
        width: 56,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountFund.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'resource',
        headerName: 'Resource',
        width: 83,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountResource.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'year',
        headerName: 'Year',
        width: 50,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountYear.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'goal',
        headerName: 'Goal',
        width: 56,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountGoal.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'function',
        headerName: 'Function',
        width: 79,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountFunction.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'object',
        headerName: 'Object',
        width: 65,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountObject.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'location',
        headerName: 'School',
        width: 67,
        renderCell: (params) => (
          <Tooltip title={params.row?.accountLocation.name}>{params.value}</Tooltip>
        ),
        ...numberColumnType,
      },
      {
        field: 'accountObject.name',
        headerName: 'Name',
        valueGetter: (_, row) => row.accountObject?.name,
        flex: 1,
        sortable: false,
        filterable: false,
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
            showInMenu
            icon={<Iconify icon="solar:eye-bold" />}
            label="View"
            // onClick={() => handleViewRow(params.row.id)}
          />,
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:pen-bold" />}
            label="Edit"
            // onClick={() => handleEditRow(params.row.id)}
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
      debouncedFilterChange(filterModel.items?.[0]?.value !== undefined ? filterModel : {});
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
    <DataGrid
      disableRowSelectionOnClick
      rows={accounts}
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
        toolbar: AccountTableToolBar as GridSlots['toolbar'],
        noRowsOverlay: () => <EmptyContent />,
        noResultsOverlay: () => <EmptyContent title="No accounts found" />,
        pagination: DataGridPagination,
        loadingOverlay: DataGridSkeleton,
      }}
      slotProps={{
        panel: { anchorEl: filterButtonEl },
        toolbar: { setFilterButtonEl },
        columnsManagement: { getTogglableColumns },
      }}
      sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
    />
  );
};
