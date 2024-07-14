import { Helmet } from 'react-helmet-async';

import Card from '@mui/material/Card';

import { CONFIG } from 'src/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useOrganizationContext } from 'src/libs/Organization';

import { Breadcrumbs, BreadCrumbSkeleton } from 'src/components/Breadcrumbs';

import { AccountTab } from 'src/sections/Account/AccountTab';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AccountWrapper({ children }: Props) {
  const { organization, loading } = useOrganizationContext();

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} : Accounts - ${organization?.name}`}</title>
      </Helmet>

      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <BreadCrumbSkeleton />
        ) : (
          <Breadcrumbs
            heading="Accounts"
            links={[
              { name: 'Home', href: '/' },
              { name: organization?.name, href: `/${organization?.slug}` },
              { name: 'Accounts' },
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
          <AccountTab />
          {children}
        </Card>
      </DashboardContent>
    </>
  );
}
