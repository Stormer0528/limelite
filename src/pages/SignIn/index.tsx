import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import { SignInView } from 'src/sections/SignIn';

// ----------------------------------------------------------------------

const metadata = { title: `Sign in | Jwt - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <SignInView />
    </>
  );
}
