import { useMemo } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { useAuthContext } from 'src/auth/hooks';

import { SummaryTile } from './SummaryTile';
import { OrganizationTitle } from './OrganizationTile';
// ----------------------------------------------------------------------

export function HomeView() {
  const { user, loading } = useAuthContext();
  const totalAccounts = useMemo(
    () =>
      user?.userGroups?.reduce(
        (prev, { organization }) => prev + (organization?.accountStats?.accounts ?? 0),
        0
      ) ?? 0,

    [user]
  );
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h5" sx={{ mb: { xs: 3, md: 5 } }}>
        2023-24 fiscal year
      </Typography>
      <Grid container spacing={3} disableEqualOverflow>
        <Grid xs={12} sm={6} xl={3}>
          <SummaryTile
            title="Organizations"
            total={user?.userGroups!.length ?? 0}
            icon={<BookingIllustration />}
            loading={loading}
          />
        </Grid>

        <Grid xs={12} sm={6} xl={3}>
          <SummaryTile
            title="Accounts"
            total={totalAccounts}
            icon={<CheckInIllustration />}
            loading={loading}
          />
        </Grid>

        <Grid xs={12} sm={6} xl={3}>
          <SummaryTile
            title="Vendors"
            total={124000}
            icon={<CheckoutIllustration />}
            loading={loading}
          />
        </Grid>

        <Grid xs={12} sm={6} xl={3}>
          <SummaryTile
            title="Entries"
            total={124000}
            icon={<CheckoutIllustration />}
            loading={loading}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ my: { xs: 3, md: 5 } }}>
        My organizations
      </Typography>

      <Grid container spacing={3}>
        {user?.userGroups!.map((userGroup) => (
          <Grid xs={12} sm={6} md={4} xl={3} key={userGroup.id}>
            <OrganizationTitle userGroup={userGroup} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
