import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/formatNumber';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/Iconify';

import { fileData, FileThumbnail } from '../../FileThumbnail';

import type { MultiFilePreviewProps } from '../types';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
}: MultiFilePreviewProps) {
  const renderFirstNode = firstNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && {
          width: 'auto',
          display: 'inline-flex',
        }),
      }}
    >
      {firstNode}
    </Box>
  );

  const renderLastNode = lastNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
      }}
    >
      {lastNode}
    </Box>
  );

  return (
    <Box
      component="ul"
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(thumbnail && {
          flexWrap: 'wrap',
          flexDirection: 'row',
        }),
        ...sx,
      }}
    >
      {renderFirstNode}

      {files.map((file) => {
        const { name, size } = fileData(file);

        if (thumbnail) {
          return (
            <Box component="li" key={name} sx={{ display: 'inline-flex' }}>
              <FileThumbnail
                tooltip
                imageView
                file={file}
                onRemove={() => onRemove?.(file)}
                sx={{
                  width: 80,
                  height: 80,
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }}
                slotProps={{ icon: { width: 36, height: 36 } }}
                {...slotProps?.thumbnail}
              />
            </Box>
          );
        }

        return (
          <Box
            component="li"
            key={name}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <FileThumbnail file={file} {...slotProps?.thumbnail} />

            <ListItemText
              primary={name}
              secondary={fData(size)}
              secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}
