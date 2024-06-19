/* eslint-disable perfectionist/sort-imports */

import 'dayjs/locale/en';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function DayjsProvider({ children }: Props) {
  return <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>;
}
