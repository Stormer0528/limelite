import type { TextFieldProps } from '@mui/material/TextField';
import type { Country } from 'react-phone-number-input/input';

import { useState, forwardRef } from 'react';
import PhoneNumberInput from 'react-phone-number-input/input';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { getCountryCode } from './utils';
import { CountryListPopover } from './list';

import type { PhoneInputProps } from './types';

// ----------------------------------------------------------------------

export const PhoneInput = forwardRef<HTMLDivElement, PhoneInputProps>(
  ({ value, onChange, placeholder, country: inputCountryCode, disableSelect, ...other }, ref) => {
    const defaultCountryCode = getCountryCode(value, inputCountryCode);

    const [selectedCountry, setSelectedCountry] = useState(defaultCountryCode);

    return (
      <PhoneNumberInput
        ref={ref}
        country={selectedCountry}
        inputComponent={CustomInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? 'Enter phone number'}
        InputProps={
          disableSelect
            ? undefined
            : {
                startAdornment: (
                  <InputAdornment position="start" sx={{ ml: 1 }}>
                    <CountryListPopover
                      countryCode={selectedCountry}
                      onClickCountry={(inputValue: Country) => setSelectedCountry(inputValue)}
                    />
                  </InputAdornment>
                ),
              }
        }
        {...other}
      />
    );
  }
);

// ----------------------------------------------------------------------

const CustomInput = forwardRef<HTMLInputElement, TextFieldProps>(({ ...props }, ref) => (
  <TextField inputRef={ref} {...props} />
));
