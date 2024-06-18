import type { ButtonProps } from '@mui/material/Button';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/config';

// ----------------------------------------------------------------------

export function SignInButton({ sx, ...other }: ButtonProps) {
  return (
    <Button component={RouterLink} href={CONFIG.redirectPath} variant="outlined" sx={sx} {...other}>
      Sign in
    </Button>
  );
}
