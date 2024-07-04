import { useRef, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { CONFIG } from 'src/config';
import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';

// ----------------------------------------------------------------------

type Props = {
  selection?: string;
  open: boolean;
  onClose: VoidFunction;
  onChoose: (avatar: string | File) => void;
};

export default function AvatarDialog({ selection, open, onClose, onChoose }: Props) {
  const theme = useTheme();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const avatars = useMemo(
    () =>
      [...Array(58)].map(
        (_, index) => `${CONFIG.ASSET_URL}/assets/avatars/avatar-${index + 1}.svg`
      ),
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      // TODO: Validate image file
      onChoose(files[0]);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 3 }}>Limelite Avatars</DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <ScrollBar
          sx={{
            px: 2.5,
            height: 320,
          }}
        >
          <Box
            rowGap={2}
            columnGap={2}
            display="grid"
            gridTemplateColumns="repeat(5, 1fr)"
            sx={{ my: 1 }}
          >
            {avatars.map((avatarUrl) => (
              <Box sx={{ position: 'relative', mx: 'auto' }} key={avatarUrl}>
                <Badge
                  overlap="circular"
                  color="success"
                  invisible={selection !== avatarUrl}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Iconify sx={{ color: 'common.white' }} icon="uil:check" width={16} />
                  }
                  sx={{ [`& .${badgeClasses.badge}`]: { p: 0, width: 20 } }}
                >
                  <Avatar
                    src={avatarUrl}
                    sx={{
                      cursor: selection === avatarUrl ? 'default' : 'pointer',
                      transition: theme.transitions.create('all'),
                      ...(avatarUrl === selection && {
                        transform: 'scale(1.25)',
                      }),
                      '&:hover': {
                        transform: 'scale(1.25)',
                      },
                    }}
                    onClick={() => {
                      if (selection !== avatarUrl) {
                        onChoose(avatarUrl);
                      }
                    }}
                  />
                </Badge>
              </Box>
            ))}
            <Box sx={{ position: 'relative', mx: 'auto' }}>
              <IconButton
                sx={{
                  bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
                  width: 40,
                  height: 40,
                }}
                onClick={() => {
                  inputFile.current?.click();
                }}
              >
                <Iconify icon="mingcute:add-line" />
              </IconButton>
              <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={onFileChange}
              />
            </Box>
          </Box>
        </ScrollBar>
      </DialogContent>
    </Dialog>
  );
}
