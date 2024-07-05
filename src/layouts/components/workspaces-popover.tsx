import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/Label';
import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: string;
    plan: string;
  }[];
};

export function WorkspacesPopover({ data = [], sx, ...other }: WorkspacesPopoverProps) {
  const { user } = useAuthContext();
  const popover = usePopover();

  const mediaQuery = 'sm';

  const [workspace, setWorkspace] = useState(data[0]);

  const handleChangeWorkspace = useCallback(
    (newValue: (typeof data)[0]) => {
      setWorkspace(newValue);
      popover.onClose();
    },
    [popover]
  );

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          gap: { xs: 0.5, [mediaQuery]: 1 },
          ...sx,
        }}
        {...other}
      >
        <Box
          component="img"
          alt={workspace?.name}
          src={workspace?.logo}
          sx={{ width: 24, height: 24, borderRadius: '50%' }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {workspace?.name}
        </Box>

        <Label
          color={workspace?.plan === 'Free' ? 'default' : 'info'}
          sx={{
            height: 22,
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {workspace?.plan}
        </Label>

        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'top-left' } }}
      >
        <ScrollBar
          scrollableNodeProps={{
            id: 'address-dialog-scroll-container',
          }}
          sx={{
            width: 320,
            px: 2.5,
            height: 308, // 48 * 6 + 4 * 5,
          }}
        >
          <MenuList>
            {user?.userGroups!.map((userGroup) => (
              <MenuItem
                key={userGroup.id}
                selected={userGroup.id === workspace?.id}
                onClick={() => handleChangeWorkspace(workspace)}
                sx={{ height: 48 }}
              >
                <Avatar
                  alt={userGroup.organization!.name}
                  src={userGroup.organization?.avatar?.url ?? undefined}
                  sx={{ width: 24, height: 24 }}
                />

                <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
                  {userGroup.organization!.name}
                </Typography>

                <Label color="info">{userGroup.name}</Label>
              </MenuItem>
            ))}
          </MenuList>
        </ScrollBar>
      </CustomPopover>
    </>
  );
}
