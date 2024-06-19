import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/useBoolean';

import { Iconify } from 'src/components/Iconify';

import { Image } from '../Image';
import AvatarDialog from './AvatarDialog';

// ----------------------------------------------------------------------

export interface SelectAvatarProps {
  error?: boolean;
  sx?: SxProps<Theme>;
  helperText?: React.ReactNode;
  file?: string | null;
  onChange: (value: string) => void;
}

export function SelectAvatar({ error, file, helperText, sx, onChange }: SelectAvatarProps) {
  const avatarSelection = useBoolean();
  const hasFile = !!file;
  const hasError = !!error;

  const renderPreview = hasFile && (
    <Image
      alt="avatar"
      src={file}
      sx={{
        width: 1,
        height: 1,
        borderRadius: '50%',
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '50%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasError && {
          color: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="radix-icons:avatar" width={32} />

      <Typography variant="caption">{file ? 'Update avatar' : 'Select avatar'}</Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <>
      <Box
        onClick={avatarSelection.onTrue}
        sx={{
          p: 1,
          m: 'auto',
          width: 144,
          height: 144,
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: '50%',
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,

          ...(hasError && {
            borderColor: 'error.main',
          }),
          ...(hasFile && {
            ...(hasError && {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            }),
            '&:hover .upload-placeholder': {
              opacity: 1,
            },
          }),
          ...sx,
        }}
      >
        {renderContent}
      </Box>

      {helperText && helperText}

      <AvatarDialog
        open={avatarSelection.value}
        onClose={avatarSelection.onFalse}
        onChoose={(id) => {
          onChange(`/assets/avatars/avatar_${id + 1}.jpg`);
        }}
      />
    </>
  );
}
