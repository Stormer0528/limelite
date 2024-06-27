import type { UserGroupWithChildren } from 'src/sections/OrganizationEdit/types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fNumber } from 'src/utils/formatNumber';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  node: UserGroupWithChildren;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (id: string) => void;
  onAssign: (id: string) => void;
};

// ----------------------------------------------------------------------
export default function StandardNode({ node, onEdit, onRemove, onAdd, onAssign }: Props) {
  return (
    <Card
      sx={{
        minWidth: 200,
        borderRadius: 1.5,
        textAlign: 'left',
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        textTransform: 'capitalize',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z8,
          '& .user-group-actions': {
            opacity: 1,
          },
        },
      }}
    >
      <Stack
        direction="row"
        className="user-group-actions"
        sx={{
          opacity: 0,
          top: 8,
          right: 14,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <IconButton
          size="small"
          onClick={() => {
            onAdd(node.id);
          }}
        >
          <Iconify icon="mingcute:add-fill" width={16} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            onEdit(node.id);
          }}
        >
          <Iconify icon="solar:pen-bold" width={16} />
        </IconButton>
        <IconButton
          size="small"
          color="info"
          onClick={() => {
            onAssign(node.id);
          }}
        >
          <Iconify icon="solar:user-plus-bold" width={16} />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          disabled={!node.parentId}
          onClick={() => {
            onRemove(node.id);
          }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography variant="subtitle1" noWrap sx={{ pb: 1 }}>
          {node.name}
        </Typography>
        <AvatarGroup
          sx={{
            [`& .${avatarGroupClasses.avatar}`]: {
              width: 24,
              height: 24,
            },
          }}
          total={node.users?.length}
          max={6}
        >
          {node.users?.slice(0, 6).map(
            (user) =>
              user && (
                <Tooltip title={user.name} key={user.id}>
                  <Avatar alt={user.name} src={user.avatar?.url ?? undefined} />
                </Tooltip>
              )
          )}
        </AvatarGroup>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
      <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 2, pt: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="mdi:account-wrench-outline" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.Account}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="fluent:building-bank-link-48-regular" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.BankAccount}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="iconamoon:cloud-upload" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.BatchUpload}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="quill:creditcard" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.CreditCard}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="mdi:customer-service" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.Customer}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="carbon:report" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.Report}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="mingcute:briefcase-line" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {node.permissions.Vendor}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Iconify icon="iconoir:dollar" />
          <Typography variant="caption" component="div" noWrap sx={{ color: 'text.secondary' }}>
            {fNumber(node.permissions.ApprovalAmount) || 0}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
