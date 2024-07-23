import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import { fShortenNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: number;
  icon: React.ReactElement;
  loading?: boolean;
};

export function SummaryTile({ title, total, icon, loading, sx, ...other }: Props) {
  return (
    <Card
      sx={{
        p: 2,
        pl: 3,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ my: 1.5, typography: 'h3' }}>
          {loading ? <Skeleton variant="text" width="50%" /> : fShortenNumber(total)}
        </Box>
      </Box>

      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
