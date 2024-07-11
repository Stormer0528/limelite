import { Helmet } from 'react-helmet-async';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config';
import { useOrganizationContext } from 'src/libs/Organization';

// ----------------------------------------------------------------------

export default function OrganizationHome() {
  const { organization, loading } = useOrganizationContext();

  return (
    <>
      <Helmet>
        <title>{`${CONFIG.site.name} - ${organization?.name}`}</title>
      </Helmet>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {loading ? <Skeleton /> : `Welcome to ${organization?.name} 👋`}
      </Typography>
    </>
  );
}
