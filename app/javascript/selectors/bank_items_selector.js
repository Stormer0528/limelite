import {createSelector} from "reselect";
import find from "lodash/find";
import sortBy from "lodash/sortBy";

import {
  textFilter,
  booleanFilter,
  afterDateFilter,
  beforeDateFilter,
  stringMatchFilter,
  greaterThanAmountFilter,
  lessThanAmountFilter,
} from "./filters";

export const getSelectedAccount = ({accounts, account_id}) => {
  return find(accounts, {slug: account_id}) || {};
};

function sortBankItems(items = []) {
  return sortBy(items, [sortByState, "date"]);
}

function sortByState({aasm_state}) {
  switch (aasm_state) {
    case "draft":
      return 1;
    case "needs_approval":
      return 2;
    case "approved":
      return 3;
    case "needs_revision":
      return 4;
    case "printed":
      return 5;
    case "voided":
      return 6;
    default:
      return 7;
  }
}

// Account Items filters
//------------------------------------------------------------------------------
// takes selected account object and bank: { filter } object

const getTypeFilter = ({
  bank: {
    filter: {type},
  },
}) => type;

export const getBankItems = (state, {location: {pathname}}) => {
  const {
    bank: {accounts = []},
  } = state;
  const accountId = pathname.split("/")[1];
  const account = find(accounts, {slug: accountId});

  return (account && sortBankItems(account.items)) || [];
};

export const getAccountItemsByType = createSelector(
  getTypeFilter,
  getBankItems,
  stringMatchFilter("type")
);

const getStartDateFilter = ({
  bank: {
    filter: {start_date},
  },
}) => start_date;
export const getAccountItemsAfter = createSelector(
  getStartDateFilter,
  getAccountItemsByType,
  afterDateFilter("date")
);

const getEndDateFilter = ({
  bank: {
    filter: {end_date},
  },
}) => end_date;
export const getAccountItemsBefore = createSelector(
  getEndDateFilter,
  getAccountItemsAfter,
  beforeDateFilter("date")
);

const getMemoFilter = ({
  bank: {
    filter: {memo},
  },
}) => memo;
export const getAccountItemsByMemo = createSelector(
  getMemoFilter,
  getAccountItemsBefore,
  textFilter("memo")
);

const getReoconciledFilter = ({
  bank: {
    filter: {reconciled = false},
  },
}) => {
  return reconciled;
};
export const getAccountItemsByReconciled = createSelector(
  getReoconciledFilter,
  getAccountItemsByMemo,
  booleanFilter("reconciled")
);

const getStateFilter = ({
  bank: {
    filter: {aasm_state},
  },
}) => aasm_state;

export const getAccountItemsByState = createSelector(
  getStateFilter,
  getAccountItemsByReconciled,
  stringMatchFilter("aasm_state")
);

const getVendorFilter = ({
  bank: {
    filter: {vendor_id},
  },
}) => vendor_id;

export const getAccountItemsByVendor = createSelector(
  getVendorFilter,
  getAccountItemsByState,
  stringMatchFilter("vendor_id")
);

const getNumberFilter = ({
  bank: {
    filter: {number},
  },
}) => number;

export const getAccountItemsByNumber = createSelector(
  getNumberFilter,
  getAccountItemsByVendor,
  textFilter("number")
);

const getMinValueFilter = ({
  bank: {
    filter: {min_amount},
  },
}) => min_amount;

export const getAccountItemsByMinValue = createSelector(
  getMinValueFilter,
  getAccountItemsByNumber,
  greaterThanAmountFilter("amount")
);

const getMaxValueFilter = ({
  bank: {
    filter: {max_amount},
  },
}) => max_amount;

export const getAccountItemsByMaxValue = createSelector(
  getMaxValueFilter,
  getAccountItemsByMinValue,
  lessThanAmountFilter("amount")
);
