import type { FieldError } from 'react-hook-form';
import type { AccountObject } from 'src/__generated__/graphql';

import { debounce } from 'lodash';
import { useState, useCallback } from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useOrganizationContext } from 'src/libs/Organization';

import { Iconify } from 'src/components/Iconify';
import { SearchNotFound } from 'src/components/search-not-found';

import { useFetchAccountObjects } from './useApollo';

// ----------------------------------------------------------------------

type Props = {
  onChange: (accountObject: AccountObject | null) => void;
  value: AccountObject | null;
  error?: FieldError;
  helperText?: React.ReactNode;
};

export function AccountObjectSelect({ value, error, helperText, onChange, ...other }: Props) {
  const [query, setQuery] = useState('');
  const { organization } = useOrganizationContext();

  const getOptionLabel = useCallback(
    (option: AccountObject | null) => (option ? `[${option.code}] ${option.name}` : ''),
    []
  );

  const { objects, loading } = useFetchAccountObjects({
    filter: {
      ...(getOptionLabel(value) === query && query
        ? { id: value?.id }
        : {
            OR: [
              { name: { contains: `%${query}%`, mode: 'insensitive' } },
              { code: { contains: `%${query}%`, mode: 'insensitive' } },
            ],
          }),

      organizationId: organization?.id,
    },
    page: '1,20',
    sort: 'name',
  });

  return (
    <Autocomplete
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={objects}
      value={value}
      onInputChange={debounce((event, newValue) => setQuery(newValue), 500)}
      getOptionLabel={getOptionLabel}
      onChange={(_, newValue) => onChange(newValue)}
      noOptionsText={<SearchNotFound query={query} />}
      isOptionEqualToValue={(a, b) => a?.id === b?.id}
      slotProps={{
        popper: { placement: 'bottom-start', sx: { minWidth: 320 } },
        paper: { sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } } },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          placeholder="Account object"
          // onKeyUp={handleKeyUp}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, accountObject, { inputValue }) => {
        const label = getOptionLabel(accountObject);
        const matches = match(label, inputValue, { insideWords: true });
        const parts = parse(label, matches);
        return (
          <li {...props} key={accountObject?.id!}>
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </li>
        );
      }}
      {...other}
    />
  );
}
