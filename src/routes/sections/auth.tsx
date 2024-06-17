import { lazy, Suspense } from 'react';

import { AuthSplitLayout } from 'src/layouts/auth-split';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const LoginPage = lazy(() => import('src/pages/SignIn'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'sign-in',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <LoginPage />
          </AuthSplitLayout>
        </GuestGuard>
      </Suspense>
    ),
  },
];
