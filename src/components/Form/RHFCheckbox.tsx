import type { Theme, SxProps } from '@mui/material/styles';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { FormGroupProps } from '@mui/material/FormGroup';
import type { FormLabelProps } from '@mui/material/FormLabel';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

type RHFCheckboxProps = Omit<FormControlLabelProps, 'control'> & {
  name: string;
  helperText?: React.ReactNode;
  slotProps?: {
    wrap?: SxProps<Theme>;
    checkbox?: CheckboxProps;
    formHelperText?: FormHelperTextProps;
  };
};

export function RHFCheckbox({ name, helperText, label, slotProps, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  const ariaLabel = `Checkbox ${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box sx={slotProps?.wrap}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                {...slotProps?.checkbox}
                inputProps={{
                  ...(!label && { 'aria-label': ariaLabel }),
                  ...slotProps?.checkbox?.inputProps,
                }}
              />
            }
            label={label}
            {...other}
          />

          {(!!error || helperText) && (
            <FormHelperText error={!!error} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </Box>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiCheckboxProps = FormGroupProps & {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  slotProps?: {
    wrap?: SxProps<Theme>;
    checkbox?: CheckboxProps;
    formLabel?: FormLabelProps;
    formHelperText?: FormHelperTextProps;
  };
  options: {
    label: string;
    value: string;
  }[];
};

export function RHFMultiCheckbox({
  name,
  label,
  options,
  slotProps,
  helperText,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  const accessibility = (val: string) => val;
  const ariaLabel = (val: string) => `Checkbox ${val}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
          {label && (
            <FormLabel
              component="legend"
              {...slotProps?.formLabel}
              sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel?.sx }}
            >
              {label}
            </FormLabel>
          )}

          <FormGroup {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(getSelected(field.value, option.value))}
                    name={accessibility(option.label)}
                    {...slotProps?.checkbox}
                    inputProps={{
                      ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                      ...slotProps?.checkbox?.inputProps,
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
