import {createSelector} from "reselect";
import {textFilter, stringMatchFilter, booleanFilter} from "./filters";

// Invoice filters
//------------------------------------------------------------------------------

const getStateFilter = ({index_view: {invoiceFilter: {aasm_state}} = {}}) =>
  aasm_state;
const getNameFilter = ({index_view: {invoiceFilter: {vendor_name}} = {}}) =>
  vendor_name;
const getNumberFilter = ({index_view: {invoiceFilter: {number}} = {}}) =>
  number;
const getPaidFilter = ({index_view: {invoiceFilter: {paid}} = {}}) => paid;

export const getInvoices = ({invoices = []}) => invoices;

export const getInvoicesByState = createSelector(
  getStateFilter,
  getInvoices,
  stringMatchFilter("aasm_state")
);

export const getInvoicesByName = createSelector(
  getNameFilter,
  getInvoicesByState,
  textFilter("vendor_name")
);

export const getInvoicesByNumber = createSelector(
  getNumberFilter,
  getInvoicesByName,
  textFilter("number")
);

export const getInvoicesByPaid = createSelector(
  getPaidFilter,
  getInvoicesByNumber,
  booleanFilter("paid")
);
