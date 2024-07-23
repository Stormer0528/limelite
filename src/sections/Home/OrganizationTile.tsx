import type { UserGroup } from 'src/__generated__/graphql';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/formatNumber';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  userGroup: UserGroup;
};

export function OrganizationTitle({ userGroup: { organization, ...userGroup } }: Props) {
  if (!organization) {
    return null;
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack sx={{ p: 3, pb: 2, flex: 1 }}>
        <Avatar
          alt={organization.name}
          src={organization.avatar?.url ?? undefined}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        />

        <ListItemText
          sx={{ mb: 1 }}
          primary={
            <Link
              component={RouterLink}
              href={paths.organization.root(organization.slug)}
              color="inherit"
            >
              {organization?.name}
            </Link>
          }
          secondary={`Since ${fDate(organization.createdAt)}`}
          primaryTypographyProps={{ typography: 'subtitle1' }}
          secondaryTypographyProps={{
            mt: 1,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
        {[
          {
            label: `${fNumber(organization?.accountStats?.accounts ?? 0)} accounts`,
            icon: <Iconify icon="uil:transaction" width={16} sx={{ flexShrink: 0 }} />,
          },
          {
            label: `2 bank accounts`,
            icon: <Iconify icon="hugeicons:bank" width={16} sx={{ flexShrink: 0 }} />,
          },
          {
            label: `10 vendors`,
            icon: <Iconify icon="hugeicons:service" width={16} sx={{ flexShrink: 0 }} />,
          },
          {
            label: `2 entries`,
            icon: <Iconify icon="carbon:report" width={16} sx={{ flexShrink: 0 }} />,
          },
        ].map((item) => (
          <Stack
            key={item.label}
            spacing={0.5}
            flexShrink={0}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', minWidth: 0 }}
          >
            {item.icon}
            <Typography variant="caption" noWrap>
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Card>
  );
}
