import { useMemo } from 'react';

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

  return (
    <OrganizationContext.Provider value={memoizedValue}>{children}</OrganizationContext.Provider>
  );
}
