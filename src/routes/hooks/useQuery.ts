import type { GridSortModel } from '@mui/x-data-grid';

import { parse, stringify } from 'qs';
import { useMemo, useCallback } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

interface QueryParams<FilterType = any> {
  sort?: GridSortModel; // define the type for sort
  page?: { page: number; pageSize: number };
  filter?: FilterType; // TODO: This will be used for prisma filter
  [key: string]: any;
}

export function useQuery<FilterType>(): [
  QueryParams<FilterType>,
  {
    setQueryParams: (params: QueryParams<FilterType>) => void;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    setSort: (sort: GridSortModel) => void;
    setFilter: (filter: FilterType) => void;
  },
] {
  const [searchParams, setSearchParams] = _useSearchParams();

  const queryParams: QueryParams = useMemo<QueryParams>(() => {
    const { sort: rawSort, page: rawPage, filter, ...rest } = parse(searchParams.toString());
    const result: QueryParams = { ...rest, filter };

    if (rawSort) {
      result.sort = (rawSort as string).split(',').map((sortStr) => {
        const sort = sortStr.startsWith('-') ? 'desc' : 'asc';
        const field = sortStr.replace('-', '');

        return { field, sort };
      });
    }

    if (rawPage) {
      const [page, pageSize] = (rawPage as string).split(',').map((value) => parseInt(value, 10));
      result.page = { page, pageSize };
    }

    return result;
  }, [searchParams]);

  const setQueryParams = useCallback(
    ({ page, sort, ...rest }: QueryParams) => {
      const queryObject = { ...rest };

      if (sort) {
        queryObject.sort = sort
          .map(({ field, sort: order }) => `${order === 'asc' ? '' : '-'}${field}`)
          .join(',');
      }

      if (page) {
        queryObject.page = `${page.page},${page.pageSize}`;
      }

      setSearchParams(stringify(queryObject, { allowEmptyArrays: true }));
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (page: number) => {
      setQueryParams({
        ...queryParams,
        page: { page, pageSize: queryParams.page?.pageSize ?? 10 },
      });
    },
    [queryParams, setQueryParams]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      setQueryParams({
        ...queryParams,
        page: { page: 1, pageSize },
      });
    },
    [queryParams, setQueryParams]
  );

  const setSort = useCallback(
    (sort: GridSortModel) => {
      setQueryParams({ ...queryParams, sort });
    },
    [queryParams, setQueryParams]
  );

  const setFilter = useCallback(
    (filter: FilterType) => {
      setQueryParams({ ...queryParams, filter });
    },
    [queryParams, setQueryParams]
  );

  return useMemo(
    () => [queryParams, { setQueryParams, setPage, setPageSize, setSort, setFilter }],
    [queryParams, setQueryParams, setPage, setPageSize, setSort, setFilter]
  );
}
