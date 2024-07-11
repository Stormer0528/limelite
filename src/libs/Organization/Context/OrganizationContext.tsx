import { createContext } from 'react';

import type { OrganizationContextValue } from '../types';

// ----------------------------------------------------------------------

export const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);
