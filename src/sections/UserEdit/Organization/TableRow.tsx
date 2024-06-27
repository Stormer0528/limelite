import type { UserGroup } from 'src/__generated__/graphql';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate, fTime } from 'src/utils/format-time';

import { toast } from 'src/components/SnackBar';
import { Iconify } from 'src/components/Iconify';

import { useUnassignUser } from './useApollo';

// ----------------------------------------------------------------------

type Props = {
  row: UserGroup;
  currentUserId: string;
  refetchUser: () => void;
};

export default function CustomTableRow({ row, currentUserId, refetchUser }: Props) {
  const router = useRouter();
  const { unassignUser, loading } = useUnassignUser();

  const { name, permissions, organization, createdAt } = row;
  return (
    <TableRow hover>
      <TableCell
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: (theme) => theme.vars.palette.action.hover },
        }}
        onClick={() => {
          router.push(paths.dashboard.org.edit(organization?.id!));
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            alt={organization?.name}
            src={organization?.avatar?.url ?? undefined}
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
        </Box>
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
        <Tooltip title="Remove" placement="top" arrow>
          <IconButton
            color="error"
            disabled={loading}
            onClick={async () => {
              await unassignUser({ userId: currentUserId, userGroupId: row.id });
              toast.success('Successfully removed');
              refetchUser();
            }}
          >
            <Iconify icon={loading ? 'svg-spinners:ring-resize' : 'solar:trash-bin-trash-bold'} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
