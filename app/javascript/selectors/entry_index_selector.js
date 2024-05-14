import {createSelector} from "reselect";
import sortBy from "lodash/sortBy";

import {
  afterDateFilter,
  beforeDateFilter,
  stringMatchFilter,
  greaterThanAmountFilter,
  lessThanAmountFilter,
} from "./filters";

function sortEntries(items = []) {
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

export const getEntries = ({entries = []}) => sortEntries(entries);

export const getEntriesByType = createSelector(
  getTypeFilter,
  getEntries,
  stringMatchFilter("type")
);

const getStartDateFilter = ({
  bank: {
    filter: {start_date},
  },
}) => start_date;
export const getEntriesAfter = createSelector(
  getStartDateFilter,
  getEntriesByType,
  afterDateFilter("date")
);

const getEndDateFilter = ({
  bank: {
    filter: {end_date},
  },
}) => end_date;
export const getEntriesBefore = createSelector(
  getEndDateFilter,
  getEntriesAfter,
  beforeDateFilter("date")
);

const getStateFilter = ({
  bank: {
    filter: {aasm_state},
  },
}) => aasm_state;

export const getEntriesByState = createSelector(
  getStateFilter,
  getEntriesBefore,
  stringMatchFilter("aasm_state")
);

const getVendorFilter = ({
  bank: {
    filter: {vendor_id},
  },
}) => vendor_id;

export const getEntriesByVendor = createSelector(
  getVendorFilter,
  getEntriesByState,
  stringMatchFilter("vendor_id")
);

const getMinValueFilter = ({
  bank: {
    filter: {min_amount},
  },
}) => min_amount;

export const getEntriesByMinValue = createSelector(
  getMinValueFilter,
  getEntriesByVendor,
  greaterThanAmountFilter("amount")
);

const getMaxValueFilter = ({
  bank: {
    filter: {max_amount},
  },
}) => max_amount;

export const getEntriesByMaxValue = createSelector(
  getMaxValueFilter,
  getEntriesByMinValue,
  lessThanAmountFilter("amount")
);
