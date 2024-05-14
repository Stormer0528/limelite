// Common Helper Functions
// -----------------------------------------------------------------------------
import isNil from "lodash/isNil";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import {greaterThanEqualTo, lessThanEqualTo} from "../utils";

import {createSelector} from "reselect";

// Comparison Functions
//------------------------------------------------------------------------------

// boolean
const booleanComparison = ({value, comparison}) => value === comparison;

// lessThanAmount
const lessThanAmountComparison = ({value, comparison}) =>
  lessThanEqualTo(comparison, value);

// greaterThanAmount
const greaterThanAmountComparison = ({value, comparison}) =>
  greaterThanEqualTo(comparison, value);

// lessThanDate
const lessThanDateComparison = ({value, comparison}) =>
  new Date(value) < new Date(comparison);

// greaterThanDate
const greaterThanDateComparison = ({value, comparison}) =>
  new Date(value) > new Date(comparison);

// stringMatch
const stringMatchComparison = ({value, comparison}) => value === comparison;

// textMatch
const textMatchComparison = ({value, comparison}) => {
  return (
    (comparison.toLocaleLowerCase() || "").indexOf(value.toLocaleLowerCase()) >=
    0
  );
};

// Filter Functions
//------------------------------------------------------------------------------

// Text Filter
export const textFilter = (filterField, {defaultValue = ""} = {}) => (
  textSearch = defaultValue,
  items
) => {
  if (isEmpty(textSearch) || isNil(textSearch)) {
    return items;
  }

  return filter(items, ({[filterField]: filterFieldVal = ""}) => {
    return (
      ((filterFieldVal && filterFieldVal.toLocaleLowerCase()) || "").indexOf(
        textSearch.toLocaleLowerCase()
      ) >= 0
    );
  });
};

// Before Date Filter
export const beforeDateFilter = (filterField = "date", {defaultValue} = {}) => (
  endDate = defaultValue,
  items = []
) => {
  if (isEmpty(endDate) || isNil(endDate)) {
    return items;
  }
  return filter(
    items,
    ({[filterField]: fieldVal}) => new Date(fieldVal) <= new Date(endDate)
  );
};

// After Date Filter
export const afterDateFilter = (filterField = "date", {defaultValue} = {}) => (
  startDate = defaultValue,
  items = []
) => {
  if (isEmpty(startDate) || isNil(startDate)) {
    return items;
  }
  return filter(
    items,
    ({[filterField]: fieldVal}) => new Date(fieldVal) >= new Date(startDate)
  );
};

// Static Value Filter (i.e. for dropdown values)
export const stringMatchFilter = (filterField, {defaultValue} = {}) => (
  filterValue = defaultValue,
  items
) => {
  // Note: isEmpty does not work for numbers
  if (isEmpty(`${filterValue}`) || isNil(filterValue)) {
    return items;
  }

  return filter(items, {[filterField]: filterValue});
};

// Amount Filter
export const lessThanAmountFilter = (
  filterField = "amount",
  {defaultValue} = {}
) => (maxVal = defaultValue, items = []) => {
  if (isEmpty(maxVal) || isNil(maxVal)) {
    return items;
  }
  return filter(items, ({[filterField]: fieldVal}) =>
    lessThanEqualTo(fieldVal, maxVal)
  );
};

export const greaterThanAmountFilter = (
  filterField = "amount",
  {defaultValue} = {}
) => (minVal = defaultValue, items = []) => {
  if (isEmpty(minVal) || isNil(minVal)) {
    return items;
  }
  return filter(items, ({[filterField]: fieldVal}) =>
    greaterThanEqualTo(fieldVal, minVal)
  );
};

// Boolean Filter
export const booleanFilter = (filterField, {defaultValue = false} = {}) => (
  bool = defaultValue,
  items = []
) => {
  if (isNil(bool)) {
    return items;
  }

  return filter(
    items,
    ({[filterField]: item_selected}) => item_selected === bool
  );
};

/**
 * Auto create filters
 * @param filterObj: Object with key that is path to value
 *                   and object that describes filter
 * @example
 *   {["bank.number"]: {
 *       default: "",
 *       // V-- One of ["string","match", "boolean", "beforeDate", "afterDate", "lessThanAmount", "greaterThanAmount"]
 *       filterType: "string",
 *       filterFunc: function(){}, // <-- Only used if filter set to custom
 *     }
 *   }
 */
export const createFilter = (
  initialCollectionFunc = function() {},
  filterObj = {}
) => {
  return Object.entries(filterObj)
    .map(
      ({
        [0]: valuePath,
        [1]: {filterType = "match", filterFunc /*default: defaultVal*/},
      }) => {
        // get filter function
        const filter = getFilterFunc(filterType, filterFunc);

        // get appropriate filter

        return {
          valueFunc: getValueFunc(valuePath),
          filter: filter(...valuePath.split(".").slice(-1)),
        };
      }
    )
    .reduce((currentCollectionFunc, {valueFunc, filter}) => {
      return createSelector(currentCollectionFunc, valueFunc, filter);
    }, initialCollectionFunc);
};

const getFilterFunc = (filterType, filterFunc) => {
  switch (filterType) {
    case "string":
      return textFilter;
    case "match":
      return stringMatchFilter;
    case "boolean":
      return booleanFilter;
    case "beforeDate":
      return beforeDateFilter;
    case "afterDate":
      return afterDateFilter;
    case "lessThanAmount":
      return lessThanAmountFilter;
    case "greaterThanAmount":
      return greaterThanAmountFilter;
    default:
      return filterFunc;
  }
};

const getValueFunc = valuePath => (state = {}) => {
  return valuePath.split(".").reduce((curState, prop) => curState[prop], state);
};

/**
 * Generic filter for filtering on multiple items where all must be true
 * @arg filterField (String)- The field in rowData that we are filtering on
 * @arg filters (Array)- array of objects (arrays)
 * @example [{type: "boolean", value: false}, {type: "string", value: 'val'}]
 */
export const allFilter = (
  filterField,
  filterTypes = [],
  {defaultValue = []} = {}
) => (filterValues = defaultValue, items = []) => {
  const filters = filterTypes.map((type, i) => ({
    type,
    value: filterValues[i],
  }));
  if (!filters || filters.length === 0) {
    return items;
  }

  const filterFuncs = filters.map(({type, value: comparison}) => val =>
    filterObjToFunction(type)({val, comparison})
  );

  return items.filter(({[filterField]: item_selected}) =>
    filterFuncs.map(func => func(item_selected)).every(test => test)
  );
};

export const filterObjToFunction = ({type = ""}) => {
  switch (type) {
    case "boolean":
      return booleanComparison;
    case "lessThanAmount":
      return lessThanAmountComparison;
    case "greaterThanAmount":
      return greaterThanAmountComparison;
    case "lessThanDate":
      return lessThanDateComparison;
    case "greaterThanDate":
      return greaterThanDateComparison;
    case "stringMatch":
      return stringMatchComparison;
    case "textMatch":
      return textMatchComparison;
    default:
      return () => true;
  }
};

export const anyFilter = (filterField, {defaultValue = []} = {}) => (
  filters = defaultValue,
  items = []
) => {
  if (!filters || filters.length === 0) {
    return items;
  }

  const filterFuncs = filters.map(({type, value: comparison}) => val =>
    filterObjToFunction(type)({val, comparison})
  );

  return items.filter(({[filterField]: item_selected}) =>
    filterFuncs.map(func => func(item_selected)).some(test => test)
  );
};

export const dateRangeFilter = ({filterField = "date"}) => {
  return allFilter(filterField, ["lessThanDate", "greaterThanDate"]);
};

export const amountRangeFilter = ({filterField = "amount"}) => {
  return allFilter(filterField, ["lessThanAmount", "greaterThanAmount"]);
};
