import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config';
import { gql } from 'src/__generated__/gql';
import { DashboardContent } from 'src/layouts/dashboard';
import { AddressableType } from 'src/__generated__/graphql';

import { Iconify } from 'src/components/Iconify';
import { Breadcrumbs } from 'src/components/Breadcrumbs';
import { LoadingScreen } from 'src/components/loading-screen';

import UserGroup from './UserGroup';
import OrganizationGeneral from './General';
import OrganizationAddress from './Address';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="hugeicons:profile" width={24} />,
  },
  {
    value: 'address',
    label: 'Address',
    icon: <Iconify icon="mdi:address-marker-outline" width={24} />,
  },
  {
    value: 'user-group',
    label: 'User Group',
    icon: <Iconify icon="tabler:binary-tree" width={24} />,
  },
  {
    value: 'schools',
    label: 'Schools',
    icon: <Iconify icon="material-symbols:school-outline" width={24} />,
  },
  {
    value: 'uploads',
    label: 'Uploads',
    icon: <Iconify icon="iconamoon:cloud-upload" width={24} />,
  },
];

// ----------------------------------------------------------------------
const FETCH_ORGANIZATION = gql(/* GraphQL */ `
  query FetchOrganization($filter: JSONObject) {
    organizations(filter: $filter) {
      organizations {
        id
        name
        slug
        description
        email
        phone
        avatar {
          url
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`);

// ----------------------------------------------------------------------
export default function OrganizationEditView() {
  const params = useParams();
  const router = useRouter();

  const [fetchOrganization, { loading, data, called }] = useLazyQuery(FETCH_ORGANIZATION);

  // Loading state including first initial render
  const [isLoading, setIsLoading] = useState(true);

  const { id: orgId, tab: tabParam } = params;

  const organization = data?.organizations?.organizations?.[0];

  useEffect(() => {
    fetchOrganization({ variables: { filter: { id: orgId } } });
  }, [fetchOrganization, orgId]);

  useEffect(() => {
    setIsLoading(!called || loading);
  }, [loading, called]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!organization) {
    return <Navigate to={paths.notFound} replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} - ${organization.name}`}</title>
      </Helmet>
      <DashboardContent>
        <Breadcrumbs
          heading={organization.name}
          links={[
            {
              name: 'Organization',
              href: paths.dashboard.org.root,
            },
            { name: organization.name },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
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
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {tabParam === 'general' && <OrganizationGeneral currentOrg={organization} />}
        {tabParam === 'address' && (
          <OrganizationAddress
            addressableId={organization.id}
            addressableType={AddressableType.Organization}
          />
        )}
        {tabParam === 'user-group' && <UserGroup orgId={organization.id} />}
        {tabParam === 'schools' && <OrganizationGeneral currentOrg={organization} />}
        {tabParam === 'uploads' && <OrganizationGeneral currentOrg={organization} />}
      </DashboardContent>
    </>
  );
}
