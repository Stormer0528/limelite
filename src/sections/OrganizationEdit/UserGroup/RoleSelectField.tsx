import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import { alpha, styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';

import { Iconify } from 'src/components/Iconify';

import { UserGroupRole } from '../types';
// ----------------------------------------------------------------------

interface Props extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  helperText?: React.ReactNode;
}
// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------
const OPTION = {
  [UserGroupRole.None]: { icon: 'radix-icons:value-none' },
  [UserGroupRole.Viewer]: { icon: 'hugeicons:view' },
  [UserGroupRole.Editor]: { icon: 'ic:baseline-edit' },
  [UserGroupRole.Owner]: { icon: 'eos-icons:master' },
};

export default function RoleSelectField({ name, label, helperText }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
            <StyledLabel>{label}</StyledLabel>

            {Object.values(UserGroupRole).map((option) => (
              <ButtonBase
                key={option}
                onClick={() => {
                  field.onChange(option);
                }}
                sx={{
                  py: 0.5,
                  pl: 0.75,
                  pr: 1.25,
                  fontSize: 12,
                  borderRadius: 1,
                  lineHeight: '20px',
                  textTransform: 'capitalize',
                  fontWeight: 'fontWeightBold',
                  color: 'default.main',
                  boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.grey[500], 0.24)}`,
                  ...(option === field.value && {
                    boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.success.main}`,
                    color: 'success.main',
                  }),
                }}
              >
                <Iconify icon={OPTION[option].icon} sx={{ mr: 0.5 }} />
                {option}
              </ButtonBase>
            ))}
          </Stack>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}
