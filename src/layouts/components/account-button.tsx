import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';

import NoSsr from '@mui/material/NoSsr';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { varHover, AnimateAvatar } from 'src/components/animate';

// ----------------------------------------------------------------------

export type AccountButtonProps = IconButtonProps & {
  open: boolean;
  photoURL: string;
  displayName: string;
};

export function AccountButton({ open, photoURL, displayName, sx, ...other }: AccountButtonProps) {
  const theme = useTheme();

  const renderFallback = (
    <Avatar
      sx={{
        width: 40,
        height: 40,
        border: `solid 2px ${theme.vars.palette.background.default}`,
      }}
    >
      <SvgIcon>
        <circle cx="12" cy="6" r="4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
          opacity="0.5"
        />
      </SvgIcon>
    </Avatar>
  );

  return (
    <IconButton
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      sx={{ p: 0, ...sx }}
      {...other}
    >
      <NoSsr fallback={renderFallback}>
        <AnimateAvatar
          slotProps={{
            avatar: { src: photoURL, alt: displayName },
            overlay: {
              border: 1,
              spacing: 2,
              color: `conic-gradient(${theme.vars.palette.primary.main}, ${theme.vars.palette.warning.main}, ${theme.vars.palette.primary.main})`,
            },
          }}
        >
          {displayName?.charAt(0).toUpperCase()}
        </AnimateAvatar>
      </NoSsr>
    </IconButton>
  );
}
