import {createSelector} from "reselect";
import isNil from "lodash/isNil";
import find from "lodash/find";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";

export const getSelectedAccount = ({accounts, account_id}) => {
  return find(accounts, {slug: account_id}) || {};
};

// Pritn Checks filters
//------------------------------------------------------------------------------
// takes selected account object and bank: { filter } object

export const getItems = ({printerConfiguration: {checks = []}}) =>
  Object.values(checks);
export const getStartDate = ({
  printerConfiguration: {
    filter: {start_date},
  },
}) => start_date;
export const getEndDate = ({
  printerConfiguration: {
    filter: {end_date},
  },
}) => end_date;

export const getAccountItemsAfter = createSelector(
  getStartDate,
  getItems,
  (start_date, items) => {
    if (isEmpty(start_date) || isNil(start_date)) {
      return items;
    }

    return filter(items, item => {
      return new Date(item.date) >= new Date(start_date);
    });
  }
);

export const getAccountItemsBefore = createSelector(
  getEndDate,
  getAccountItemsAfter,
  (end_date, items = []) => {
    if (isEmpty(end_date) || isNil(end_date)) {
      return items;
    }

    return filter(items, item => {
      return new Date(item.date) <= new Date(end_date);
    });
  }
);
