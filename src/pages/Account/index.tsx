import { Helmet } from 'react-helmet-async';

import Stack from '@mui/material/Stack';

import { CONFIG } from 'src/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useOrganizationContext } from 'src/libs/Organization';

import { Breadcrumbs, BreadCrumbSkeleton } from 'src/components/Breadcrumbs';

import { AccountTab } from 'src/sections/Account/AccountTab';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AccountHome({ children }: Props) {
  const { organization, loading } = useOrganizationContext();

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} : Accounts - ${organization?.name}`}</title>
      </Helmet>

      <DashboardContent>
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
        <Stack spacing={2} direction="row">
          <AccountTab />
          {children}
        </Stack>
      </DashboardContent>
    </>
  );
}
