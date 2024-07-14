import * as React from 'react';
import { IMaskInput } from 'react-imask';

import TextField from '@mui/material/TextField';

import type { MaskInputProps } from './types';

interface CustomProps {
  onChange?: (value: any) => void;
  mask?: any;
  definitions?: any;
  name?: string;
}

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      inputRef={ref}
      onAccept={(value: any) => onChange && onChange(value)}
      overwrite
    />
  );
});

export const MaskInput = ({ mask, definitions, onChange, ...other }: MaskInputProps) => (
  <TextField
    {...other}
    InputProps={{
      inputComponent: TextMaskCustom as any,
      inputProps: {
        mask,
        definitions,
        onChange,
      },
    }}
  />
);
