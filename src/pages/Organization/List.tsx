import { Helmet } from 'react-helmet-async';

import OrganizationList from 'src/sections/OrganizationList';

// ----------------------------------------------------------------------

export default function OrganizationListPage() {
  return (
    <>
      <Helmet>
        <title>Limelite: Organizations</title>
      </Helmet>

      <OrganizationList />
    </>
  );
}
