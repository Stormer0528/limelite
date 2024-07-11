import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumbs } from 'src/components/Breadcrumbs';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function OrganizationAccount() {
  return (
    <DashboardContent>
      <Breadcrumbs
        heading="Accounts"
        links={[{ name: 'Home', href: '/' }, { name: 'Accounts' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
    </DashboardContent>
  );
}
