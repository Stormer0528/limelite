import type { RouteObject } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const Home = lazy(() => import('src/pages/Home'));

const OrganizationProvider = lazy(() => import('src/libs/Organization'));
const OrganizationHome = lazy(() => import('src/pages/Organization/Home'));

const AccountWrapper = lazy(() => import('src/pages/Account/Wrapper'));
const AccountList = lazy(() => import('src/pages/Account/List'));
const AccountFund = lazy(() => import('src/pages/Account/Fund'));
const AccountResource = lazy(() => import('src/pages/Account/Resource'));

const BankList = lazy(() => import('src/pages/Bank/List'));

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
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
        element: (
          <OrganizationProvider>
            <Outlet />
          </OrganizationProvider>
        ),
        children: [
          { index: true, element: <OrganizationHome /> },
          {
            path: 'accounts',
            element: (
              <AccountWrapper>
                <Suspense fallback={<LoadingScreen />}>
                  <Outlet />
                </Suspense>
              </AccountWrapper>
            ),
            children: [
              { index: true, element: <Navigate to="list" replace /> },
              { path: 'list', element: <AccountList /> },
              { path: 'funds', element: <AccountFund /> },
              { path: 'resources', element: <AccountResource /> },
              { path: 'years', element: <div>I am years</div> },
              { path: 'goals', element: <div>I am goals</div> },
              { path: 'functions', element: <div>I am functions</div> },
              { path: 'objects', element: <div>I am objects</div> },
              { path: 'schools', element: <div>I am schools</div> },
            ],
          },
          {
            path: 'banks',
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <Outlet />
              </Suspense>
            ),
            children: [
              { index: true, element: <BankList /> },
              { path: ':id', element: <div>I am bank details</div> },
            ],
          },
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
