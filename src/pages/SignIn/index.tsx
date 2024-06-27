import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config';

import { SignInView } from 'src/sections/SignIn';

// ----------------------------------------------------------------------

const metadata = { title: `${CONFIG.site.name} - Sign in` };

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
