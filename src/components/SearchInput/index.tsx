import debounce from 'lodash/debounce';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/Iconify';

// ----------------------------------------------------------------------

type Props = {
  search: string;
  placeholder?: string;
  onSearchChange: (value: string) => void;
};

/**
 * Debounce search input changes to prevent too many API requests.
 * Used for filtering data in the table.
 */
export function SearchInput({ search, placeholder, onSearchChange }: Props) {
  const [keyword, setKeyword] = useState(search);

  useEffect(() => {
    setKeyword(search);
  }, [search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilterChange = useCallback(
    debounce((value) => {
      onSearchChange(value);
    }, 500),
    [onSearchChange]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(event.target.value);
      debouncedFilterChange(event.target.value);
    },
    [debouncedFilterChange]
  );
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      flexGrow={1}
      sx={{ width: 1, p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <TextField
        fullWidth
        value={keyword}
        onChange={handleSearchChange}
        placeholder={placeholder || 'Search by email or name...'}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          ...(!!search && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    onSearchChange('');
                  }}
                  edge="end"
                >
                  <Iconify icon="ic:outline-close" />
                </IconButton>
              </InputAdornment>
            ),
          }),
        }}
      />
    </Stack>
  );
}
