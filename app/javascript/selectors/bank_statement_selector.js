import {createSelector} from "reselect";
import {isNil, filter, isEmpty, sortBy} from "lodash";

// Account Items filters
//------------------------------------------------------------------------------
// takes selected account object and bank: { filter } object

const getTypeFilter = ({
  statement: {
    filter: {type},
  },
}) => type;

export const getBankAccountId = ({accounts, account_id}) =>
  find(accounts, {slug: account_id}) || {};

const getStatementItems = state => {
  const {
    statement: {availableItems = {}},
  } = state;

  return availableItems;
};

export const getAccountItemsByType = createSelector(
  getStatementItems,
  getTypeFilter,
  (items, type) => {
    if (isEmpty(type) || isNil(type) || type === "ALL") {
      return items;
    }
    return filter(
      items,
      ({type: itemType}) => itemType.toLowerCase() === type.toLowerCase()
    );
  }
);

const getStartDateFilter = ({
  statement: {
    filter: {start_date},
  },
}) => start_date;
export const getAccountItemsAfter = createSelector(
  getStartDateFilter,
  getAccountItemsByType,
  (start_date, items) => {
    if (isEmpty(start_date) || isNil(start_date)) {
      return items;
    }
    return filter(items, item => new Date(item.date) >= new Date(start_date));
  }
);

const getEndDateFilter = ({
  statement: {
    filter: {end_date},
  },
}) => end_date;
export const getAccountItemsBefore = createSelector(
  getEndDateFilter,
  getAccountItemsAfter,
  (end_date, items = []) => {
    if (isEmpty(end_date) || isNil(end_date)) {
      return items;
    }

    return filter(items, item => new Date(item.date) <= new Date(end_date));
  }
);

const getMemoFilter = ({
  statement: {
    filter: {memo},
  },
}) => memo;
export const getAccountItemsByMemo = createSelector(
  getMemoFilter,
  getAccountItemsBefore,
  (memo, items) => {
    if (isEmpty(memo) || isNil(memo)) {
      return items;
    }

    return filter(
      items,
      ({memo: item_memo = ""}) =>
        ((item_memo && item_memo.toLocaleLowerCase()) || "").indexOf(
          memo.toLocaleLowerCase()
        ) >= 0
    );
  }
);

const getPayeeFilter = ({
  statement: {
    filter: {name},
  },
}) => name;
export const getAccountItemsByPayee = createSelector(
  getPayeeFilter,
  getAccountItemsBefore,
  (name, items) => {
    if (isEmpty(name) || isNil(name)) {
      return items;
    }

    return filter(items, ({payee}) => {
      return (payee || "").indexOf(name) >= 0;
    });
  }
);

const getNumberFilter = ({
  statement: {
    filter: {number},
  },
}) => number;
export const getAccountItemsByNumber = createSelector(
  getNumberFilter,
  getAccountItemsByPayee,
  (number, items) => {
    if (isEmpty(number) || isNil(number)) {
      return items;
    }

    return filter(
      items,
      ({number: item_number = ""}) =>
        ((item_number && item_number.toLocaleLowerCase()) || "").indexOf(
          number.toLocaleLowerCase()
        ) >= 0
    );
  }
);

export const getSortSettings = ({statement: {sort}}) => sort;
export const getSortedItems = createSelector(
  getSortSettings,
  getAccountItemsByNumber,
  ({direction, column}, items = []) => {
    if (isEmpty(column) || isNil(column)) {
      return items;
    }

    let newItems = [];
    // Special Search options
    // Note: must set newItems
    switch (column) {
      case "amount":
        newItems = sortBy(items, ({amount}) =>
          Number(amount.replace(/[,$]/gi, ""))
        );
        break;
      case "name":
        newItems = sortBy(items, ({payee, vendor}) =>
          isEmpty(payee) ? vendor : payee
        );
        break;
      case "date":
        newItems = sortBy(items, ({date}) => new Date(date).toISOString());
        break;
      case "check#":
        newItems = sortBy(items, ({number = ""}) =>
          Number((number || "").replace(/[,$a-zA-z]/gi, ""))
        );
        break;
      default:
        newItems = sortBy(items, column);
    }

    return direction === "asc" ? newItems : newItems.reverse();
  }
);
