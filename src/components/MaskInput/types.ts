import type { TextFieldProps } from '@mui/material/TextField';

export type MaskInputProps = TextFieldProps & {
  mask: any;
  definitions?: any;
  onChange?: (value: any) => void;
};
