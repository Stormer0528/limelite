import type { Organization } from 'src/__generated__/graphql';
import type { ListItemButtonProps } from '@mui/material/ListItemButton';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = ListItemButtonProps & {
  organization: Organization;
  selected: boolean;
  assigned: boolean;
};

export function OrganizationItem({ organization, selected, assigned, sx, ...other }: Props) {
  return (
    <Box component="li" sx={{ display: 'flex' }}>
      <ListItemButton
        disableGutters
        sx={{
          p: 1,
          gap: 2,
          borderRadius: 1,
          ...(selected && { bgcolor: 'action.selected' }),
          ...sx,
        }}
        {...other}
      >
        <Avatar alt={organization.name} src={organization.avatarUrl ?? ''}>
          {organization.name.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          primary={organization.name}
          primaryTypographyProps={{ noWrap: true, component: 'span', variant: 'subtitle2' }}
          secondary={organization.email}
          secondaryTypographyProps={{
            noWrap: true,
            component: 'span',
            variant: 'body2',
            color: 'text.secondary',
          }}
        />

        {assigned && <Iconify icon="eva:checkmark-fill" sx={{ color: 'primary.main' }} />}
      </ListItemButton>
    </Box>
  );
}
