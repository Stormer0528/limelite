import { Helmet } from 'react-helmet-async';

import Card from '@mui/material/Card';

import { CONFIG } from 'src/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useOrganizationContext } from 'src/libs/Organization';

import { Breadcrumbs, BreadCrumbSkeleton } from 'src/components/Breadcrumbs';

import { BankListView } from 'src/sections/Bank/List/View';

// ----------------------------------------------------------------------

export default function BankList() {
  const { organization, loading } = useOrganizationContext();

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} : Banks - ${organization?.name}`}</title>
      </Helmet>

      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <BreadCrumbSkeleton />
        ) : (
          <Breadcrumbs
            heading="Banks"
            links={[
              { name: 'Home', href: '/' },
              { name: organization?.name, href: `/${organization?.slug}` },
              { name: 'Banks' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}
        <Card
          sx={{
            flexGrow: 1,
            display: 'flex',
            height: 2,
            p: 2,
            overflow: 'hidden',
          }}
        >
          <BankListView />
        </Card>
      </DashboardContent>
    </>
  );
}
