import type { User } from 'src/__generated__/graphql';

import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/Label';
import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: User;
  onSelectRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,

  onSelectRow,
}: Props) {
  const router = useRouter();

  const {
    id,
    name,
    avatar,
    email,
    isSuperAdmin,
    isApUser,
    createdAt,
    updatedAt,
    deletedAt,
    userGroups,
  } = row;
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          '&:hover': { bgcolor: (theme) => theme.vars.palette.action.hover },
        }}
        onClick={() => {
          router.push(paths.dashboard.user.edit(id));
        }}
      >
        <Avatar alt={name} src={avatar?.url ?? undefined} sx={{ mr: 2 }} />

        <ListItemText
          primary={name}
          secondary={email}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <AvatarGroup
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 24,
              height: 24,
            },
          }}
          total={userGroups?.length}
          max={6}
        >
          {userGroups?.slice(0, 6).map(
            ({ organization }) =>
              organization && (
                <Tooltip title={organization.name}>
                  <Avatar
                    key={organization.id}
                    alt={organization.name}
                    src={organization.avatar?.url ?? undefined}
                  />
                </Tooltip>
              )
          )}
        </AvatarGroup>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {isSuperAdmin && (
          <Label variant="soft" color="secondary">
            Admin
          </Label>
        )}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {isApUser && (
          <Label variant="soft" color="info">
            AP user
          </Label>
        )}
      </TableCell>

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
      <TableCell>
        <ListItemText
          primary={fDate(updatedAt)}
          secondary={fTime(updatedAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell>
        {deletedAt ? (
          <Tooltip title={`Deactivated at ${fDateTime(deletedAt)}`} placement="top" arrow>
            <Label variant="soft" color="error">
              Inactive
            </Label>
          </Tooltip>
        ) : (
          <Label variant="soft" color="success">
            Active
          </Label>
        )}
      </TableCell>

      <TableCell align="left" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <Tooltip title="View" placement="top" arrow>
          <IconButton
            color="default"
            onClick={() => {
              router.push(paths.dashboard.user.edit(id));
            }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
