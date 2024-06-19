import { Helmet } from 'react-helmet-async';

import OrganizationCreate from 'src/sections/OrganizationCreate';

// ----------------------------------------------------------------------

export default function OrganizationCreatePage() {
  return (
    <>
      <Helmet>
        <title>Limelite: New Organization</title>
      </Helmet>

      <OrganizationCreate />
    </>
  );
}
