import type { Dayjs } from 'dayjs';
import type { TextFieldProps } from '@mui/material/TextField';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { MobileDateTimePickerProps } from '@mui/x-date-pickers/MobileDateTimePicker';

import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type RHFDatePickerProps = DatePickerProps<Dayjs> & {
  name: string;
};

export function RHFDatePicker({ name, slotProps, ...other }: RHFDatePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.date}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? (slotProps?.textField as TextFieldProps)?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMobileDateTimePickerProps = MobileDateTimePickerProps<Dayjs> & {
  name: string;
};

export function RHFMobileDateTimePicker({
  name,
  slotProps,
  ...other
}: RHFMobileDateTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDateTimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.dateTime}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? (slotProps?.textField as TextFieldProps)?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}
