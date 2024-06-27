import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import UserList from 'src/sections/UserList';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} - Users`}</title>
      </Helmet>

      <UserList />
    </>
  );
}
