import {createSelector} from "reselect";
import {isNil, find, isEmpty, sortBy} from "lodash";

// Account Items filters
//------------------------------------------------------------------------------
// takes selected account object and bank: { filter } object

const getStatements = (state, {location: {pathname}}) => {
  const {
    credit_card: {accounts = []},
  } = state;
  const accountId = pathname.split("/")[1];
  const account = find(accounts, {slug: accountId});

  return (account && account.statements) || [];
};

// export const getSortSettings = ({statement: {indexSort}}) => indexSort;
export const getSortSettings = ({statement: {indexSort}}) => indexSort;
export const getSortedStatements = createSelector(
  getSortSettings,
  getStatements,
  ({direction, column}, items = []) => {
    if (isEmpty(column) || isNil(column)) {
      return items;
    }

    let newItems = [];
    // Special Search options
    // Note: must set newItems
    switch (column) {
      case "ending_balance":
        newItems = sortBy(items, ({ending_balance}) =>
          Number(ending_balance.replace(/[,$]/gi, ""))
        );
        break;
      case "start_date":
        newItems = sortBy(items, ({started_at}) =>
          new Date(started_at).toISOString()
        );
        break;
      default:
        newItems = sortBy(items, column);
    }

    return direction === "asc" ? newItems : newItems.reverse();
  }
);
