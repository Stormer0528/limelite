import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumbs } from 'src/components/Breadcrumbs';

import NewOrganizationForm from './NewOrganizationForm';

// ----------------------------------------------------------------------

export default function OrganizationCreateView() {
  return (
    // TODO: Consider moving this Container to dashboard route definition as every page will have same layout
    <DashboardContent>
      <Breadcrumbs
        heading="Create a new organization"
        links={[
          {
            name: 'Organization',
            href: paths.dashboard.org.root,
          },
          { name: 'New organization' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <NewOrganizationForm />
    </DashboardContent>
  );
}
