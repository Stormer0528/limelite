import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  selection?: number;
  open: boolean;
  onClose: VoidFunction;
  onChoose: (index: number) => void;
};

export default function AvatarDialog({ selection, open, onClose, onChoose }: Props) {
  const theme = useTheme();
  const avatars = useMemo(
    () => [...Array(25)].map((_, index) => `/assets/avatars/avatar_${index + 1}.jpg`),
    []
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 3 }}>Avatars</DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns="repeat(5, 1fr)"
          sx={{ my: 1 }}
        >
          {avatars.map((avatarUrl, index) => (
            <Box sx={{ position: 'relative', mx: 'auto' }} key={avatarUrl}>
              <Avatar
                src={avatarUrl}
                sx={{
                  '&:hover': {
                    opacity: 0.48,
                    transform: 'scale(1.25)',
                  },
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: theme.transitions.create('all'),
                  ...(index === selection && {
                    opacity: 0.48,
                    transform: 'scale(1.25)',
                    boxShadow: '-4px 12px 24px 0 rgb(0,0,0,0.24)',
                  }),
                }}
                onClick={() => {
                  onChoose(index);
                  onClose();
                }}
              />
              <Iconify
                icon="icon-park:check-small"
                width={24}
                sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
