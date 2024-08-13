import { Controller, useFormContext } from 'react-hook-form';

import { AccountObjectSelect } from 'src/sections/Account/Object/Select';

// ----------------------------------------------------------------------

export type RHFAutocompleteProps = {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
};

export function RHFAccountObjectSelect({ name, helperText, ...other }: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AccountObjectSelect
          value={field.value}
          onChange={(newValue) => setValue(name, newValue, { shouldValidate: true })}
          error={error}
          helperText={helperText}
          {...other}
        />
      )}
    />
  );
}
