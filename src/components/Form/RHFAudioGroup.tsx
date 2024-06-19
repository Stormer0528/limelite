import type { RadioProps } from '@mui/material/Radio';
import type { Theme, SxProps } from '@mui/material/styles';
import type { FormLabelProps } from '@mui/material/FormLabel';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import { Controller, useFormContext } from 'react-hook-form';

import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

type Props = RadioGroupProps & {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  slotProps?: {
    wrap?: SxProps<Theme>;
    radio: RadioProps;
    formLabel: FormLabelProps;
    formHelperText: FormHelperTextProps;
  };
  options: {
    label: string;
    value: string;
  }[];
};

export function RHFRadioGroup({ name, label, options, helperText, slotProps, ...other }: Props) {
  const { control } = useFormContext();

  const labelledby = `${name}-radio-buttons-group-label`;
  const ariaLabel = (val: string) => `Radio ${val}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
          {label && (
            <FormLabel
              id={labelledby}
              component="legend"
              {...slotProps?.formLabel}
              sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel.sx }}
            >
              {label}
            </FormLabel>
          )}

          <RadioGroup {...field} aria-labelledby={labelledby} {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    {...slotProps?.radio}
                    inputProps={{
                      ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                      ...slotProps?.radio?.inputProps,
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </RadioGroup>

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
