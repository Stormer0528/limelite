import type { Country } from 'react-phone-number-input';

import { parsePhoneNumber } from 'react-phone-number-input';

import { countries } from 'src/assets/data/countries';

// ----------------------------------------------------------------------

export function getCountryCode(inputValue: string, countryCode?: Country) {
  if (inputValue) {
    const phoneNumber = parsePhoneNumber(inputValue);

    if (phoneNumber) {
      return phoneNumber?.country;
    }
  }

  return countryCode ?? 'US';
}

// ----------------------------------------------------------------------

export function getCountry(countryCode?: Country) {
  const option = countries.filter((country) => country.code === countryCode)[0];
  return option;
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  query: string;
  inputData: typeof countries;
};

export function applyFilter({ inputData, query }: ApplyFilterProps) {
  if (query) {
    return inputData.filter(
      (country) =>
        country.label.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.code.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        country.phone.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}
