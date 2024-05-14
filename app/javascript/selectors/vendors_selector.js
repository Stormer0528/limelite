import {createSelector} from "reselect";
import {textFilter, stringMatchFilter} from "./filters";

// Vendor filters
//------------------------------------------------------------------------------

const getStateFilter = ({index_view: {vendorFilter: {aasm_state}} = {}}) =>
  aasm_state;
const getNameFilter = ({index_view: {vendorFilter: {name}} = {}}) => name;
const getNumberFilter = ({index_view: {vendorFilter: {number}} = {}}) => number;

export const getVendors = ({vendors = []}) => vendors;

export const getVendorsByState = createSelector(
  getStateFilter,
  getVendors,
  stringMatchFilter("aasm_state")
);

export const getVendorsByName = createSelector(
  getNameFilter,
  getVendorsByState,
  textFilter("name")
);

export const getVendorsByNumber = createSelector(
  getNumberFilter,
  getVendorsByName,
  textFilter("account_number")
);
