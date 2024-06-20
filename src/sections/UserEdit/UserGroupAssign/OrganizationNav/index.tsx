import type { UserGroup, Organization } from 'src/__generated__/graphql';

import debounce from 'lodash/debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { CONFIG } from 'src/config';

import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';
import { EmptyContent } from 'src/components/EmptyContent';

import { useSearchOrganizations } from '../useApollo';
import { OrganizationItem } from './OrganizationItem';
import { OrganizationItemSkeleton } from './OrganizationItemSkeleton';

// ----------------------------------------------------------------------

type Props = {
  onClickOrganization: (org: Organization) => void;
  assignedUserGroups: UserGroup[];
  selectedOrganization?: Organization;
};

export function OrganizationNav({
  onClickOrganization,
  assignedUserGroups,
  selectedOrganization,
}: Props) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [total, setTotal] = useState<number>(0);
  const page = useRef(1);

  const { searchOrganizations, loading } = useSearchOrganizations();

  const fetchMoreOrganizations = useCallback(
    async (newPage: number) => {
      const { data } = await searchOrganizations({
        page: newPage,
        keyword: debouncedKeyword,
      });
      setOrganizations((prev) => [...prev, ...(data?.organizations.organizations ?? [])]);
      setTotal(data?.organizations.total ?? 0);

      page.current = newPage;
    },
    [debouncedKeyword, searchOrganizations]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((value) => {
      page.current = 1;
      setOrganizations([]);
      setTotal(0);
      setDebouncedKeyword(value);
    }, 500),
    []
  );
  const handleSearchOrganizations = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(event.target.value);
      debouncedFilterChange(event.target.value);
    },
    [debouncedFilterChange]
  );

  useEffect(() => {
    fetchMoreOrganizations(1);
  }, [fetchMoreOrganizations]);

  const renderEmpty = useMemo(
    () => (
      <Stack sx={{ px: 2, flex: '1 1 auto' }}>
        <EmptyContent
          title="No result"
          imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-folder-empty.svg`}
        />
      </Stack>
    ),
    []
  );

  const renderLoading = useMemo(
    () => (
      <Stack sx={{ px: 3, flex: '1 1 auto' }}>
        <OrganizationItemSkeleton />
      </Stack>
    ),
    []
  );

  return (
    <>
      <Stack sx={{ px: 2 }}>
        <Stack direction="row" sx={{ mb: 2 }}>
          Organizations <Typography component="span">({total})</Typography>
        </Stack>
        <TextField
          placeholder="Search organizations"
          value={keyword}
          onChange={handleSearchOrganizations}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
      <ScrollBar
        sx={{ flex: '1 1 0' }}
        scrollableNodeProps={{
          id: 'user-organization-scrollable',
        }}
      >
        <InfiniteScroll
          next={() => {
            fetchMoreOrganizations(page.current + 1);
          }}
          dataLength={organizations.length}
          hasMore={organizations.length < total}
          loader={renderLoading}
          scrollableTarget="user-organization-scrollable"
          scrollThreshold="125px"
        >
          {loading ? (
            renderLoading
          ) : (
            <>
              {organizations.length ? (
                <nav>
                  <Box
                    component="ul"
                    sx={{
                      px: 2,
                      pb: 1,
                      gap: 0.5,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {organizations.map((organization) => (
                      <OrganizationItem
                        key={organization.id}
                        organization={organization}
                        assigned={assignedUserGroups.some(
                          (userGroup) => userGroup.organization!.id === organization.id
                        )}
                        selected={organization.id === selectedOrganization?.id}
                        onClick={() => {
                          onClickOrganization(organization);
                        }}
                      />
                    ))}
                  </Box>
                </nav>
              ) : (
                renderEmpty
              )}
            </>
          )}
        </InfiniteScroll>
      </ScrollBar>
    </>
  );
}
