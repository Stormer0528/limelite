import type { UserGroup } from 'src/__generated__/graphql';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: UserGroup;
  onSelectRow: VoidFunction;
};

export default function CustomTableRow({ row, selected, onSelectRow }: Props) {
  const router = useRouter();

  const { name, permissions, organization, createdAt } = row;
  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={organization?.name}
          src={organization?.avatarUrl || undefined}
          sx={{ mr: 2 }}
        />

        <ListItemText
          primary={organization?.name}
          secondary={organization?.email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{name}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.Account}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.BankAccount}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.BatchUpload}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.CreditCard}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.Customer}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.Report}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.Vendor}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{permissions.ApprovalAmount}</TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(createdAt)}
          secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="left" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="View" placement="top" arrow>
          <IconButton
            color="default"
            onClick={() => {
              router.push(paths.dashboard.org.editUserGroup(organization!.id));
            }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
