import { useLazyQuery } from '@apollo/client';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { gql } from 'src/__generated__/gql';

import { toast } from 'src/components/SnackBar';

import { AuthContext } from './AuthContext';
import { setSession, getSession, getTimeToLive } from '../utils';

import type { AuthContextValue } from '../types';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

// ----------------------------------------------------------------------
const FETCH_ME_QUERY = gql(/* GraphQL */ `
  query FetchMe {
    me {
      id
      name
      email
      avatar {
        url
      }
      userGroups {
        id
        name
        organization {
          id
          name
          slug
          avatar {
            url
          }
        }
        permissions {
          Account
          ApprovalAmount
          BankAccount
          BatchUpload
          CreditCard
          Customer
          Report
          Vendor
        }
      }
    }
  }
`);

// ----------------------------------------------------------------------
const initialToken = getSession();

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | undefined | null>(initialToken);
  const timeToLive = useMemo(() => getTimeToLive(token), [token]);
  const router = useRouter();
  const timerId = useRef<NodeJS.Timeout | undefined>();

  const [fetchMe, { data, loading, error }] = useLazyQuery(FETCH_ME_QUERY);

  const expireToken = useCallback(() => {
    setToken(null);
    setSession(null);
    toast.error('Your session has expired. Please login again.');
    router.push(paths.signIn);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = useCallback((newToken: string) => {
    setSession(newToken);
    setToken(newToken);
    toast.success('Successfully logged in');
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    setToken(null);
    toast.success('Successfully logged out');
  }, []);

  useEffect(() => {
    if (token) {
      if (timeToLive <= 0) {
        expireToken();
      }
      fetchMe();
    }
  }, [token, timeToLive, expireToken, fetchMe]);

  useEffect(() => {
    if (error) {
      expireToken();
      return;
    }

    if (!timerId.current) {
      timerId.current = setTimeout(() => {
        expireToken();
      }, timeToLive);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timerId.current);
    };
  }, [timeToLive, error, expireToken]);

  const user = useMemo(() => (error ? null : data?.me), [data, error]);

  const memoizedValue: AuthContextValue = useMemo(
    () => ({ user, token, isAuthenticated: !!token, loading, signIn, signOut }),
    [user, token, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
