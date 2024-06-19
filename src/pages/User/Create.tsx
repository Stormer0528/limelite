import { Helmet } from 'react-helmet-async';

import UserCreate from 'src/sections/UserCreate';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Limelite: New User</title>
      </Helmet>

      <UserCreate />
    </>
  );
}
