import {createSelector} from "reselect";
import {textFilter, stringMatchFilter} from "./filters";

// Customer filters
//------------------------------------------------------------------------------

const getStateFilter = ({index_view: {customerFilter: {aasm_state}} = {}}) =>
  aasm_state;
const getNameFilter = ({index_view: {customerFilter: {name}} = {}}) => name;
const getNumberFilter = ({index_view: {customerFilter: {number}} = {}}) =>
  number;

export const getCustomers = ({customers = []}) => customers;

export const getCustomersByState = createSelector(
  getStateFilter,
  getCustomers,
  stringMatchFilter("aasm_state")
);

export const getCustomersByName = createSelector(
  getNameFilter,
  getCustomersByState,
  textFilter("name")
);

export const getCustomersByNumber = createSelector(
  getNumberFilter,
  getCustomersByName,
  textFilter("account_number")
);
