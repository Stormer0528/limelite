import Skeleton from '@mui/material/Skeleton';

export const BreadCrumbSkeleton = () => (
  <>
    <Skeleton variant="text" sx={{ fontSize: 24, mb: 1 }} />
    <Skeleton variant="text" />
  </>
);
