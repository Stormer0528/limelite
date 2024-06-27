import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import UserCreate from 'src/sections/UserCreate';

// ----------------------------------------------------------------------
const metadata = { title: `${CONFIG.site.name} - New user` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <UserCreate />
    </>
  );
}
