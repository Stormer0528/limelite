import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const Home = lazy(() => import('src/pages/Home'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: ':slug',
        children: [
          { index: true, element: <div>I am organization</div> },
          { path: 'accounts', element: <div>I am accounts</div> },
          // { path: 'new', element: <UserCreatePage /> },
          // {
          //   path: ':id',
          //   children: [
          //     { index: true, element: <Navigate to="general" replace /> },
          //     {
          //       path: ':tab',
          //       element: <UserEditPage />,
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];
