import { useMemo } from 'react';
import { Navigate } from 'react-router';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useFetchOrganization } from '../useApollo';
import { OrganizationContext } from './OrganizationContext';

import type { OrganizationContextValue } from '../types';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function OrganizationProvider({ children }: Props) {
  const params = useParams();

  const { organization, loading } = useFetchOrganization(params.slug!);

  const memoizedValue: OrganizationContextValue = useMemo(
    () => ({ organization, loading }),
    [organization, loading]
  );

  if (!loading && !organization) {
    return <Navigate to={paths.notFound} />;
  }

  return (
    <OrganizationContext.Provider value={memoizedValue}>{children}</OrganizationContext.Provider>
  );
}
