import type { LabelColor } from 'src/components/Label';
import type { SortOrder } from 'src/routes/hooks/useQuery';

import { useMemo, useCallback } from 'react';
import { useQuery as useGraphQuery } from '@apollo/client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useQuery } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/useBoolean';

import { gql } from 'src/__generated__/gql';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/Label';
import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';
import { SearchInput } from 'src/components/SearchInput';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/Table';

import UserTableRow from './UserTableRow';
import UserTableFiltersResult from './UserTableFiltersResult';

import type { UserRole, IUserPrismaFilter, IUserTableFilters } from './types';

// ----------------------------------------------------------------------

const STATUS_OPTIONS: { value: UserRole; label: string; color: LabelColor }[] = [
  { value: 'all', label: 'All', color: 'info' },
  { value: 'admin', label: 'Admin', color: 'success' },
  { value: 'ap', label: 'AP user', color: 'secondary' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'organizations', label: 'Organization', width: 220 },
  { id: 'isSuperAdmin', label: 'Admin', width: 130, sortable: true },
  { id: 'isApUser', label: 'AP user', width: 130, sortable: true },
  { id: 'createdAt', label: 'Created At', width: 140, sortable: true },
  { id: 'updatedAt', label: 'Updated At', width: 140, sortable: true },
  { id: 'deletedAt', label: 'Status', width: 95, sortable: true },
  { id: '', width: 50 },
];

const defaultFilter: IUserTableFilters = {
  search: '',
  status: 'all',
};

// ----------------------------------------------------------------------

const FETCH_USER_STATS_QUERY = gql(/* GraphQL */ `
  query FetchUserStats(
    $adminFilter: JSONObject
    $apFilter: JSONObject
    $inactiveFilter: JSONObject
  ) {
    all: users {
      total
    }
    admin: users(filter: $adminFilter) {
      total
    }
    ap: users(filter: $apFilter) {
      total
    }
    inactive: users(filter: $inactiveFilter) {
      total
    }
  }
`);

const FETCH_USERS_QUERY = gql(/* GraphQL */ `
  query FetchUsers($page: String, $filter: JSONObject, $sort: String) {
    users(page: $page, filter: $filter, sort: $sort) {
      users {
        id
        name
        email
        avatarUrl
        isSuperAdmin
        isApUser
        createdAt
        updatedAt
        deletedAt
        userGroups {
          id
          name
          permissions {
            Account
            ApprovalAmount
            BankAccount
            BatchUpload
            CreditCard
            Customer
            Report
            Vendor
          }
          organization {
            id
            name
            slug
            avatarUrl
          }
        }
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------

export default function UserListView() {
  const table = useTable();

  const [query, { setQueryParams: setQuery, setPage, setPageSize }] = useQuery<IUserTableFilters>();

  const { page = { page: 1, pageSize: 10 }, sort, filter = defaultFilter } = query;

  const graphQueryFilter = useMemo(() => {
    const filterObj: IUserPrismaFilter = {};
    if (filter.search) {
      filterObj.OR = [
        { name: { contains: filter.search } },
        { email: { contains: filter.search } },
      ];
    }

    if (filter.status === 'admin') {
      filterObj.isSuperAdmin = true;
    }

    if (filter.status === 'ap') {
      filterObj.isApUser = true;
    }

    if (filter.status === 'inactive') {
      filterObj.deletedAt = { not: null };
    }

    return filterObj;
  }, [filter]);

  const graphQuerySort = useMemo(() => {
    if (!sort) return undefined;

    return Object.entries(sort)
      .map(([key, value]) => `${value === 'asc' ? '' : '-'}${key}`)
      .join(',');
  }, [sort]);

  const confirm = useBoolean();

  const canReset = !!filter.search;

  const { data: statsData } = useGraphQuery(FETCH_USER_STATS_QUERY, {
    variables: {
      adminFilter: { isSuperAdmin: true },
      apFilter: { isApUser: true },
      inactiveFilter: { deletedAt: { not: null } },
    },
  });

  const { loading, data } = useGraphQuery(FETCH_USERS_QUERY, {
    variables: {
      page: page && `${page.page},${page.pageSize}`,
      filter: graphQueryFilter,
      sort: graphQuerySort,
    },
  });
  const tableData = data?.users;

  const notFound = (canReset && !tableData?.users?.length) || !tableData?.users?.length;

  const handleTabChange = (event: React.SyntheticEvent, newValue: UserRole) => {
    setQuery({
      ...query,
      filter: { ...filter, status: newValue },
      page: { page: 1, pageSize: query.page?.pageSize ?? 10 },
    });
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery({ ...query, filter: { ...filter, search: value } });
    },
    [setQuery, query, filter]
  );

  return (
    <DashboardContent>
      <Breadcrumbs
        heading="User"
        links={[{ name: 'User', href: paths.dashboard.user.root }, { name: 'List' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <Tabs
          value={filter.status}
          onChange={handleTabChange}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={(tab.value === filter.status && 'filled') || 'soft'}
                  color={tab.color}
                >
                  {statsData ? statsData[tab.value].total! : 0}
                </Label>
              }
            />
          ))}
        </Tabs>

        <SearchInput search={filter.search} onSearchChange={handleSearchChange} />

        {canReset && !loading && (
          <UserTableFiltersResult results={tableData!.total!} sx={{ p: 2.5, pt: 0 }} />
        )}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={loading ? 0 : tableData!.users!.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                tableData!.users!.map((row) => row!.id)
              )
            }
            action={
              <Tooltip title="Delete">
                <IconButton color="primary" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <ScrollBar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={sort && sort[Object.keys(sort)[0]]}
                orderBy={sort && Object.keys(sort)[0]}
                headLabel={TABLE_HEAD}
                rowCount={loading ? 0 : tableData!.users!.length}
                numSelected={table.selected.length}
                onSort={(id) => {
                  const isAsc = sort && sort[id] === 'asc';
                  const newSort = { [id]: isAsc ? 'desc' : ('asc' as SortOrder) };
                  setQuery({ ...query, sort: newSort });
                }}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData!.users!.map((row) => row!.id)
                  )
                }
              />

              {loading ? (
                <LoadingScreen />
              ) : (
                <TableBody>
                  {tableData!.users!.map((row) => (
                    <UserTableRow
                      key={row!.id}
                      row={row!}
                      selected={table.selected.includes(row!.id)}
                      onSelectRow={() => table.onSelectRow(row!.id)}
                      // onDeleteRow={() => handleDeleteRow(row.id)}
                      // onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              )}
            </Table>
          </ScrollBar>
        </TableContainer>

        <TablePaginationCustom
          count={loading ? 0 : tableData!.total!}
          page={loading ? 0 : page!.page - 1}
          rowsPerPage={page?.pageSize}
          onPageChange={(_, curPage) => {
            setPage(curPage + 1);
          }}
          onRowsPerPageChange={(event) => {
            setPageSize(parseInt(event.target.value, 10));
          }}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </DashboardContent>
  );
}
