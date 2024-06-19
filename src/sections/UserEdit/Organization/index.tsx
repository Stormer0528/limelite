import type { UserGroup } from 'src/__generated__/graphql';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { ScrollBar } from 'src/components/ScrollBar';
import { SearchInput } from 'src/components/SearchInput';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/Table';

import TableRow from './TableRow';
import UserTableFiltersResult from './TableFiltersResult';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'organization.name', label: 'Organization', sortable: true },

  { id: 'name', label: 'User Group Name', sortable: true },
  { id: 'permissions.Account', label: 'Account', width: 80, sortable: true },
  { id: 'permissions.BankAccount', label: 'BankAccount', width: 100, sortable: true },
  { id: 'permissions.BatchUpload', label: 'BatchUpload', width: 100, sortable: true },
  { id: 'permissions.CreditCard', label: 'CreditCard', width: 100, sortable: true },
  { id: 'permissions.Customer', label: 'Customer', width: 100, sortable: true },
  { id: 'permissions.Report', label: 'Report', width: 100, sortable: true },
  { id: 'permissions.Vendor', label: 'Vendor', width: 100, sortable: true },
  { id: 'permissions.ApprovalAmount', label: 'ApprovalAmount', width: 130, sortable: true },

  { id: 'createdAt', label: 'Assigned At', width: 140, sortable: true },
  { id: '', width: 50 },
];

type Props = {
  userGroups: UserGroup[];
};
// ----------------------------------------------------------------------

export default function UserListView({ userGroups }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });

  const [keyword, setKeyword] = useState('');

  const filteredUserGroups = applyFilter({
    userGroups,
    comparator: getComparator(table.order, table.orderBy),
    keyword,
  });

  const dataInPage = filteredUserGroups.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const notFound = (keyword && !filteredUserGroups.length) || !filteredUserGroups.length;

  const handleSearchChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  return (
    <Card>
      <SearchInput
        placeholder="Search by user group name or organization name ..."
        search={keyword}
        onSearchChange={handleSearchChange}
      />

      {keyword && (
        <UserTableFiltersResult results={filteredUserGroups.length} sx={{ p: 2.5, pt: 0 }} />
      )}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <ScrollBar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={filteredUserGroups.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
            />

            <TableBody>
              {dataInPage.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  // onDeleteRow={() => handleDeleteRow(row.id)}
                  // onEditRow={() => handleEditRow(row.id)}
                />
              ))}

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </ScrollBar>
      </TableContainer>

      <TablePaginationCustom
        count={filteredUserGroups.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

function applyFilter({
  userGroups,
  comparator,
  keyword,
}: {
  userGroups: UserGroup[];
  comparator: (a: any, b: any) => number;
  keyword: string;
}): UserGroup[] {
  const stabilizedThis = userGroups.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  userGroups = stabilizedThis.map((el) => el[0]);

  if (keyword) {
    userGroups = userGroups.filter(
      ({ name, organization }) =>
        name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ||
        organization?.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    );
  }

  return userGroups;
}
