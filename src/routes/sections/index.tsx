import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { errorRoutes } from './error';

// ----------------------------------------------------------------------

export function Router() {
  return useRoutes([
    // Auth
    ...authRoutes,

    // Main
    ...mainRoutes,

    // Error
    ...errorRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
