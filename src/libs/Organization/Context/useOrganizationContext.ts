import { useContext } from 'react';

import { OrganizationContext } from './OrganizationContext';

// ----------------------------------------------------------------------

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error('useOrganizationContext: Context must be used inside OrganizationProvider');
  }

  return context;
}
