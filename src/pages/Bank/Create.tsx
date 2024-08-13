import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useOrganizationContext } from 'src/libs/Organization';

import { Breadcrumbs, BreadCrumbSkeleton } from 'src/components/Breadcrumbs';

import { BankCreateView } from 'src/sections/Bank/Create/View';

// ----------------------------------------------------------------------

export default function BankCreatePage() {
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
            heading="New Bank"
            links={[
              { name: 'Home', href: '/' },
              { name: organization?.name, href: `/${organization?.slug}` },
              { name: 'Banks', href: paths.organization.banks(organization?.slug!) },
              { name: 'New Bank' },
            ]}
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />
        )}
        <BankCreateView />
      </DashboardContent>
    </>
  );
}
