import type { GridFilterModel } from '@mui/x-data-grid';

export function parseFilter(curFilter: any = {}, filter?: GridFilterModel) {
  const filterObj: any = { ...curFilter };

  (filter?.items ?? []).forEach((item) => {
    const { value, field, operator } = item;
    if (value !== undefined) {
      if (operator === '=' || operator === 'equals') {
        filterObj[field] = value;
      } else if (operator === '>') {
        filterObj[field] = { gt: value };
      } else if (operator === '>=') {
        filterObj[field] = { gte: value };
      } else if (operator === '<=') {
        filterObj[field] = { lte: value };
      } else if (operator === '<') {
        filterObj[field] = { lt: value };
      } else if (operator === '!=') {
        filterObj[field] = { ne: value };
      } else if (operator === 'isAnyOf') {
        filterObj[field] = { in: value };
      } else if (operator === 'contains') {
        filterObj[field] = { contains: `%${null}%`, mode: 'insensitive' };
      } else if (operator === 'startsWith') {
        filterObj[field] = { startsWith: null, mode: 'insensitive' };
      } else if (operator === 'endsWith') {
        filterObj[field] = { endsWith: null, mode: 'insensitive' };
      } else if (operator === 'isEmpty') {
        filterObj[field] = null;
      } else if (operator === 'isNotEmpty') {
        filterObj[field] = { not: null };
      }
    }
  });
  return filterObj;
}
