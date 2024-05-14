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

export const getSelectedAccount = ({accounts, account_id}) =>
  find(accounts, {slug: account_id}) || {};

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

// Statement Selectors
//------------------------------------------------------------------------------
export const getStatementItems = ({statement: {selectedItems = {}} = {}}) =>
  selectedItems;

export const getEndingBalance = ({statement: {ending_balance = ""} = {}}) =>
  parseFloat(ending_balance) || 0.0;

export const getStatementItemsArray = createSelector(
  getStatementItems,
  items => Object.values(items)
);

export const calcReconciledBalance = createSelector(
  getStatementItemsArray,
  items => {
    const totalCents = items.reduce((total, item) => {
      const {type, amountInCents} = item;
      if (type === "payment") {
        return total + parseInt(amountInCents);
      }
      return total - parseInt(amountInCents);
    }, 0);

    return (totalCents / 100).toFixed(2);
  }
);

export const calcRemainingBalance = createSelector(
  getEndingBalance,
  getStatementItemsArray,
  (endingBalance, items) => {}
);

export const calcItemBalance = createSelector(
  getStatementItemsArray,
  (state, type) => type,
  (items, type) => {
    const total = items.reduce((total, item) => {
      const {amountInCents, type: itemType} = item;
      if (type === "credit") {
        return itemType !== "Charge" ? total + parseInt(amountInCents) : total;
      }

      return itemType === "Charge" ? total + parseInt(amountInCents) : total;
    }, 0);

    return total;
  }
);
