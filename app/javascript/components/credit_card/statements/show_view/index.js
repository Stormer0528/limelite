import {connect} from "react-redux";
import {compose} from "redux";
import {formatNumber} from "humanize-plus";

import filter from "lodash/filter";
import isDate from "lodash/isDate";
import isEmpty from "lodash/isEmpty";
import {getSortedItems} from "@selectors/bank_statement_selector";
import {saveStatement} from "@actions/statement_reducer_actions";
import {
  calcReconciledBalance,
  calcItemBalance,
} from "@selectors/credit_card_items_selector";

import ThemeWrapper from "@shared/theme_wrapper";

// Components
//------------------------------------------------------------------------------
import ShowPage from "./view";

const mapStateToProps = (state) => {
  const {
    statement,
    filestack,
    statement: {
      selectedItems = {},
      starting_balance = 0,
      ending_balance = 0,
      filter,
      sort,
      aasm_action,
      editable,
      ui: {
        debits: {open: debitsOpen},
        credits: {open: creditsOpen},
        confirmationModal,
      },
    },
  } = state;

  const selectedItemsArray = Object.values(selectedItems);
  const reconciled_balance = calcReconciledBalance(state);
  const totalCredits = calcItemBalance(state, "credit");
  const totalDebits = calcItemBalance(state, "debit");

  const clearedBalance = (
    parseFloat(starting_balance || 0) +
    (totalCredits - totalDebits) / 100
  ).toFixed(2);
  const statement_balance = parseFloat(ending_balance || 0) - clearedBalance;

  const sortedItems = Object.values(getSortedItems(state));

  const debits = filterByStringAttribute(sortedItems, "type", "Charge");
  const credits = filterByStringAttributeArray(sortedItems, "type", "Payment");

  const selectedDebits = filterByStringAttribute(
    selectedItems,
    "type",
    "Charge"
  );

  const selectedCredits = filterByStringAttributeArray(
    selectedItems,
    "type",
    "Payment"
  );

  return {
    statement,
    items: getSortedItems(state),
    credits,
    debits,
    history,
    filter,
    sort,
    filestack,
    aasm_action,
    editable,
    itemCount: selectedItemsArray.length,
    totalCredits: `$${formatNumber((totalCredits / 100).toFixed(2), 2)}`,
    totalDebits: `$${formatNumber((totalDebits / 100).toFixed(2), 2)}`,
    reconciledBalance: `$${formatNumber(reconciled_balance, 2)}`,
    remainingBalance: calcRemainingBalance(ending_balance, reconciled_balance),
    selectedDebits: objectifyArray(selectedDebits),
    selectedCredits: objectifyArray(selectedCredits),
    totalSelectedDebits: selectedCredits.length,
    totalSelectedCredits: selectedDebits.length,
    debitsOpen,
    creditsOpen,
    confirmationModal,
    statement_balance,
    clearedBalance,
    valid: isValid(Object.assign({}, statement, {selectedItems})),
  };
};

const mapDispatch = (dispatch) => {
  const {
    statement: {
      setStartDate = function () {},
      setEndDate = function () {},
      setStartingBalance = function () {},
      setEndingBalance = function () {},
      addSelectedItem = function () {},
      removeSelectedItem = function () {},
      setFilterStartDate = function () {},
      setFilterEndDate = function () {},
      setFilterType = function () {},
      setFilterAmount = function () {},
      setFilterName = function () {},
      setFilterNumber = function () {},
      setSortColumnAndDirection = function () {},
      toggleFilterShow = function () {},
      toggleDebitsOpen = function () {},
      toggleCreditsOpen = function () {},
      toggleConfirmationModal = function () {},
      setFileUrl = function () {},
      setAasmAction = function () {},
    } = {},
  } = dispatch;

  return {
    loadStatement: () => {
      const id = window.location.pathname.split("/")[4];
      if (id === "new") {
        dispatch({type: "FIND_UNRECONCILED_CREDIT_CARD_ITEMS"});
      } else {
        dispatch({type: "LOAD_CREDIT_CARD_STATEMENT", id});
      }
    },
    setStartDate: ({target: {value}}) => {
      setStartDate(value);
      dispatch({type: "FIND_CREDIT_CARD_ITEMS_BY_DATE", update: true});
    },
    setEndDate: ({target: {value}}) => {
      setEndDate(value);
      dispatch({type: "FIND_CREDIT_CARD_ITEMS_BY_DATE", update: true});
    },
    setStartingBalance: ({value}) => setStartingBalance(value),
    setEndingBalance: ({value}) => setEndingBalance(value),
    createSortHandler: (column) => () => setSortColumnAndDirection(column),
    createToggleItemHandler: ({id, type, amountInCents}) => (
      _event,
      selected
    ) => {
      if (selected) {
        addSelectedItem({id, type, amountInCents});
      } else {
        removeSelectedItem({id, type, amountInCents});
      }
    },
    handleFileUrlChange: (url) => {
      setFileUrl(url);
    },
    createSubmitHandler: ({
      statement_id,
      bank_account_id,
      credit_card_id,
      statement_balance,
      state_action,
    }) => () => {
      dispatch(
        saveStatement({
          statement_id,
          statementable_id: bank_account_id || credit_card_id,
          statementable_type: "CreditCard",
          statement_balance,
          state_action,
        })
      );
    },
    handleFilterStartDateChange: ({target: {value}}) =>
      setFilterStartDate(value),
    handleFilterEndDateChange: ({target: {value}}) => setFilterEndDate(value),
    handleFilterAmountChange: ({target: {value}}) => setFilterAmount(value),
    handleFilterNameChange: ({target: {value}}) => setFilterName(value),
    handleFilterNumberChange: ({target: {value}}) => setFilterNumber(value),
    handleFilterTypeChange: ({target: {value}}) => setFilterType(value),
    handleFilterBtnClick: () => toggleFilterShow(),
    handleDebitsContainerClick: () => toggleDebitsOpen(),
    handleCreditsContainerClick: () => toggleCreditsOpen(),
    handletoggleConfirmationModal: (state_action) => {
      setAasmAction(state_action);
      toggleConfirmationModal();
    },
  };
};

// Helper Functions
//------------------------------------------------------------------------------
function calcRemainingBalance(ending_balance, remaining_balance) {
  const total =
    parseFloat(ending_balance || 0.0) - parseFloat(remaining_balance || 0.0);

  return `$${formatNumber(total, 2)}`;
}

function filterByStringAttribute(items = [], attribute, value) {
  return filter(items, {[attribute]: value});
}

function filterByStringAttributeArray(items = [], attribute, values = []) {
  return filter(items, (item) => values.includes(item[attribute]));
}

function objectifyArray(items = []) {
  return items.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
}

// Validations
//------------------------------------------------------------------------------
const isValid = ({
  selectedItems,
  started_at,
  ended_at,
  starting_balance,
  ending_balance,
}) => {
  const validations = [
    validateItemSelected(selectedItems),
    validateString(started_at),
    validateString(ended_at),
    validateString(starting_balance),
    validateString(ending_balance),
  ];

  return validations.every((check) => check === true);
};

export const validateItemSelected = (selectedItems) =>
  Object.values(selectedItems).length > 0;

export function validateDate(date) {
  return isDate(date);
}

export function validateString(str) {
  return str && !isEmpty(str);
}

// Export
//------------------------------------------------------------------------------
export default compose(
  ThemeWrapper,
  connect(mapStateToProps, mapDispatch)
)(ShowPage);
