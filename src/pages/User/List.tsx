import { Helmet } from 'react-helmet-async';

import UserList from 'src/sections/UserList';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Limelite Users</title>
      </Helmet>

      <UserList />
    </>
  );
}
