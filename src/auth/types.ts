import type { User } from 'src/__generated__/graphql';

export type AuthContextValue = {
  user?: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};
