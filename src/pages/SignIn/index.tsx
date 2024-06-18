import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import { JwtSignInView } from 'src/sections/SignIn';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtSignInView />
    </>
  );
}
