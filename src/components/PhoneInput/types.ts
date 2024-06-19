import type { TextFieldProps } from '@mui/material/TextField';
import type { Value, Country } from 'react-phone-number-input/input';

// ----------------------------------------------------------------------

export type PhoneInputProps = Omit<TextFieldProps, 'onChange' | 'ref'> & {
  value: string;
  country?: Country;
  disableSelect?: boolean;
  onChange: (newValue: Value) => void;
};

export type CountryListProps = {
  countryCode?: Country;
  onClickCountry: (inputValue: Country) => void;
};
