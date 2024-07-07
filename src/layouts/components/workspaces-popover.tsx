import type { Organization } from 'src/__generated__/graphql';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/Label';
import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps;

export function WorkspacesPopover({ sx, ...other }: WorkspacesPopoverProps) {
  const { user } = useAuthContext();
  const popover = usePopover();
  const router = useRouter();
  const params = useParams();

  const mediaQuery = 'sm';

  const handleChangeWorkspace = useCallback(
    (newValue: Organization) => {
      router.push(paths.organization.root(newValue.slug));
      popover.onClose();
    },
    [popover, router]
  );

  const curUserGroup = useMemo(
    () => user?.userGroups?.find((userGroup) => userGroup.organization?.slug === params.slug),
    [params.slug, user]
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
        <Avatar
          alt={curUserGroup?.organization!.name}
          src={curUserGroup?.organization!.avatar?.url ?? undefined}
          sx={{ width: 24, height: 24 }}
        />

        <Box
          component="span"
          sx={{
            typography: 'subtitle2',
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {curUserGroup?.organization?.name}
        </Box>

        <Label
          color="info"
          sx={{
            height: 22,
            display: { xs: 'none', [mediaQuery]: 'inline-flex' },
          }}
        >
          {curUserGroup?.name}
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
                selected={userGroup.organization?.slug === params.slug}
                onClick={() => handleChangeWorkspace(userGroup.organization!)}
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
