import type { UserGroupAssignee } from 'src/__generated__/graphql';

import debounce from 'lodash/debounce';
import { useLazyQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { gql } from 'src/__generated__/gql';

import { Iconify } from 'src/components/Iconify';
import { ScrollBar } from 'src/components/ScrollBar';
import { LoadingScreen } from 'src/components/loading-screen';
import { SearchNotFound } from 'src/components/search-not-found';

import UserItem from './UserItem';

// ----------------------------------------------------------------------

const FETCH_USERGROUP_USERS = gql(/* GraphQL */ `
  query UserGroupUsers($userGroupId: ID!, $page: Int!, $pageSize: Int!, $keyword: String) {
    userGroupUsers(userGroupId: $userGroupId, page: $page, pageSize: $pageSize, keyword: $keyword) {
      users {
        id
        name
        email
        avatarUrl
        userGroupId
        userGroupName
      }
      total
    }
  }
`);

// ----------------------------------------------------------------------
const ITEM_HEIGHT = 64;

type Props = {
  open: boolean;
  onClose: VoidFunction;
  userGroupId: string;
};

export default function UserGroupAssignDialog({ userGroupId, open, onClose }: Props) {
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [users, setUsers] = useState<UserGroupAssignee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const page = useRef(1);

  const [fetchUsers] = useLazyQuery(FETCH_USERGROUP_USERS);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((value) => {
      setDebouncedKeyword(value);
    }, 500),
    []
  );

  const handleSearchContacts = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      page.current = 1;
      setUsers([]);
      setTotal(0);
      setKeyword(event.target.value);
      debouncedFilterChange(event.target.value);
    },
    [debouncedFilterChange]
  );

  const fetchMoreUsers = useCallback(
    async (newPage: number) => {
      if (!userGroupId) {
        return;
      }
      const { data } = await fetchUsers({
        variables: {
          page: newPage,
          pageSize: 20,
          keyword: debouncedKeyword,
          userGroupId,
        },
      });
      setUsers((prevUsers) => [...prevUsers, ...(data?.userGroupUsers.users ?? [])]);
      setTotal(data?.userGroupUsers.total ?? 0);

      page.current = newPage;
    },
    [debouncedKeyword, userGroupId, fetchUsers]
  );

  useEffect(() => {
    fetchMoreUsers(1);
  }, [fetchMoreUsers]);

  const notFound = !users?.length && !!debouncedKeyword;

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Users <Typography component="span">({total})</Typography>
      </DialogTitle>

      <Box sx={{ px: 3, py: 2.5 }}>
        <TextField
          fullWidth
          value={keyword}
          onChange={handleSearchContacts}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <ScrollBar
          scrollableNodeProps={{
            id: 'address-dialog-scroll-container',
          }}
          sx={{
            px: 2.5,
            height: ITEM_HEIGHT * 6,
          }}
        >
          <InfiniteScroll
            next={() => {
              fetchMoreUsers(page.current + 1);
            }}
            dataLength={users.length}
            hasMore={users.length < total}
            loader={<LoadingScreen sx={{ my: 2 }} key={0} />}
            scrollableTarget="address-dialog-scroll-container"
            scrollThreshold="125px"
          >
            {notFound ? (
              <SearchNotFound query={keyword} sx={{ mt: 3, mb: 10 }} />
            ) : (
              <>
                {users?.map((user) => (
                  <UserItem key={user.id} user={user} userGroupId={userGroupId} />
                ))}
              </>
            )}
          </InfiniteScroll>
        </ScrollBar>
      </DialogContent>
    </Dialog>
  );
}
