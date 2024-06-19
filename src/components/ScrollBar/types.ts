import type { Theme, SxProps } from '@mui/material/styles';
import type { Props as SimpleBarProps } from 'simplebar-react';

// ----------------------------------------------------------------------

export type ScrollBarProps = SimpleBarProps & {
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  fillContent?: boolean;
  naturalScroll?: boolean;
  slotProps?: {
    wrapper?: SxProps<Theme>;
    contentWrapper?: SxProps<Theme>;
    content?: Partial<SxProps<Theme>>;
  };
};
