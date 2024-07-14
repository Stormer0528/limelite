import { useMatch } from 'react-router';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fNumber } from 'src/utils/formatNumber';

import { useOrganizationContext } from 'src/libs/Organization';

import { Label } from 'src/components/Label';

const TABS = [
  { value: 'list', label: 'Accounts', key: 'accounts' },
  { value: 'funds', label: 'Funds', key: 'accountFunds' },
  { value: 'resources', label: 'Resources', key: 'accountResources' },
  { value: 'years', label: 'Years', key: 'accountYears' },
  { value: 'goals', label: 'Goals', key: 'accountGoals' },
  { value: 'functions', label: 'Functions', key: 'accountFunctions' },
  { value: 'objects', label: 'Objects', key: 'accountObjects' },
  { value: 'schools', label: 'Schools', key: 'accountSchools' },
];

export const AccountTab = () => {
  const { organization, loading } = useOrganizationContext();
  const router = useRouter();

  const param = useMatch(paths.organization.accountsTabMatch);
  const tabParam = param?.params.tab;

  return (
    <Tabs
      value={tabParam || 'list'}
      onChange={(_, newTab) => {
        router.push(newTab);
      }}
      sx={{
        minWidth: 130,
        borderRight: 1,
        borderColor: 'divider',
      }}
      orientation="vertical"
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          label={
            <Stack direction="row" flexGrow={1} justifyContent="space-between">
              {tab.label}

              <Label
                variant={tabParam === tab.value ? 'filled' : 'soft'}
                color="success"
                sx={{ ml: 1 }}
              >
                {loading ? <Skeleton /> : fNumber(organization?.accountStats?.[tab.key] || 0)}
              </Label>
            </Stack>
          }
          // icon={tab.icon}
          value={tab.value}
        />
      ))}
    </Tabs>
  );
};
