import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import OrganizationCreate from 'src/sections/OrganizationCreate';

// ----------------------------------------------------------------------

export default function OrganizationCreatePage() {
  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} - New organization`}</title>
      </Helmet>

      <OrganizationCreate />
    </>
  );
}
