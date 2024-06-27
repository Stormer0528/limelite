import type { Organization } from 'src/__generated__/graphql';

import Box from '@mui/material/Box';
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
  row: Organization;
  onSelectRow: VoidFunction;
};

export default function CustomTableRow({ row, selected, onSelectRow }: Props) {
  const router = useRouter();

  const { id, name, slug, avatar, email, phone, users, createdAt, updatedAt, deletedAt } = row;
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell
        sx={{
          cursor: 'pointer',
          '&:hover': { bgcolor: (theme) => theme.vars.palette.action.hover },
        }}
        onClick={() => {
          router.push(paths.dashboard.org.edit(id));
        }}
      >
        <Box display="flex" alignItems="center">
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
        </Box>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{slug}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <AvatarGroup
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 24,
              height: 24,
            },
          }}
          total={users?.length}
          max={6}
        >
          {users?.slice(0, 6).map(
            (user) =>
              user && (
                <Tooltip title={user.name}>
                  <Avatar key={user.id} alt={user.name} src={user.avatar?.url ?? undefined} />
                </Tooltip>
              )
          )}
        </AvatarGroup>
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
          <Tooltip title={`Disabled at ${fDateTime(deletedAt)}`} placement="top" arrow>
            <Label variant="soft" color="error">
              Disabled
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
              router.push(paths.dashboard.org.edit(id));
            }}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
