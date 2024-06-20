import { Helmet } from 'react-helmet-async';
import { useLazyQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/useBoolean';

import { gql } from 'src/__generated__/gql';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/Label';
import { Iconify } from 'src/components/Iconify';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import UserGeneral from './General';
import Organization from './Organization';
import { UserGroupAssign } from './UserGroupAssign';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="hugeicons:profile" width={24} />,
  },
  {
    value: 'organizations',
    label: 'Organizations',
    icon: <Iconify icon="tabler:binary-tree" width={24} />,
  },
];

// ----------------------------------------------------------------------
const FETCH_USER = gql(/* GraphQL */ `
  query FetchUser($filter: JSONObject) {
    users(filter: $filter) {
      users {
        id
        name
        email
        avatarUrl
        isSuperAdmin
        isApUser
        isBackOfficeUser
        isEmailVerified
        deletedAt
        userGroups {
          id
          name
          createdAt
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
          organization {
            id
            name
            slug
            email
            avatarUrl
          }
        }
      }
    }
  }
`);

// ----------------------------------------------------------------------
export default function OrganizationEditView() {
  // Loading state including first initial render
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();

  const drawerState = useBoolean();

  const [fetchUserQuery, { loading, data, called }] = useLazyQuery(FETCH_USER);

  const { id: userId, tab: tabParam } = params;

  const fetchUser = useCallback(() => {
    fetchUserQuery({ variables: { filter: { id: userId } } });
  }, [fetchUserQuery, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setIsLoading(!called || loading);
  }, [loading, called]);

  const user = data?.users?.users?.[0];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={paths.notFound} replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`Limelite: ${user.name}`}</title>
      </Helmet>
      <DashboardContent>
        <Breadcrumbs
          heading={user.name}
          links={[{ name: 'User', href: paths.dashboard.user.root }, { name: user.name }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <Button variant="contained" onClick={drawerState.onTrue}>
              Manage organizations
            </Button>
          }
        />

        <Tabs
          value={tabParam || 'general'}
          onChange={(_, newTab) => {
            router.push(`../${newTab}`);
          }}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={
                <>
                  {tab.label}
                  {tab.value === 'organizations' && (
                    <Label
                      variant={tabParam === 'organizations' ? 'filled' : 'soft'}
                      color="success"
                      sx={{ ml: 1 }}
                    >
                      {user.userGroups?.length}
                    </Label>
                  )}
                </>
              }
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        {tabParam === 'general' && <UserGeneral currentUser={user} refetchUser={fetchUser} />}
        {tabParam === 'organizations' && (
          <Organization currentUser={user} refetchUser={fetchUser} />
        )}
      </DashboardContent>
      <UserGroupAssign
        open={drawerState.value}
        userId={userId!}
        assignedUserGroups={user.userGroups ?? []}
        onSuccess={() => {
          drawerState.onFalse();
          fetchUser();
        }}
        onClose={drawerState.onFalse}
      />
    </>
  );
}
