import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import OrganizationList from 'src/sections/OrganizationList';

// ----------------------------------------------------------------------

export default function OrganizationListPage() {
  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name}- Organizations`}</title>
      </Helmet>

      <OrganizationList />
    </>
  );
}
