import type { Organization } from 'src/__generated__/graphql';

export type OrganizationContextValue = {
  organization?: Organization | null;
  loading: boolean;
};
