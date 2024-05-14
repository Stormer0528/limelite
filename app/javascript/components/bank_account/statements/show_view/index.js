import {connect} from "react-redux";
import {compose} from "redux";
import {getSortedItems} from "../../../../selectors/bank_statement_selector.js";
import {render} from "react-dom";
import {formatNumber} from "humanize-plus";
import {lifecycle} from "recompose";
import {
  calcReconciledBalance,
  calcRemainingBalance,
  calcCreditBalance,
  filterByStringAttribute,
  objectifyArray,
} from "./helper_functions";

import isValid from "./validations";
import {saveStatement} from "../../../../actions/statement_reducer_actions";

import ThemeWrapper from "../../../shared/theme_wrapper";
import Breadcrumb from "../../breadcrumb";

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
  const reconciled_balance = calcReconciledBalance(selectedItems);
  const totalCredits = calcCreditBalance({
    items: selectedItemsArray,
    type: "credit",
  });
  const totalDebits = calcCreditBalance({
    items: selectedItemsArray,
    type: "debit",
  });
  const clearedBalance = (
    parseFloat(starting_balance || 0) +
    (totalCredits - totalDebits) / 100
  ).toFixed(2);
  const statement_balance = parseFloat(ending_balance || 0) - clearedBalance;

  const sortedItems = Object.values(getSortedItems(state, history));

  const debits = filterByStringAttribute(sortedItems, "type", "Check");
  const credits = filterByStringAttribute(sortedItems, "type", "Deposit");
  const transfers = filterByStringAttribute(
    sortedItems,
    "type",
    "AccountTransfer"
  );

  const fromTransfers = transfers.filter(
    ({isFromAccountItem}) => isFromAccountItem
  );
  const toTransfers = transfers.filter(({isToAccountItem}) => isToAccountItem);

  const selectedDebits = filterByStringAttribute(
    selectedItems,
    "type",
    "Check"
  );
  const selectedCredits = filterByStringAttribute(
    selectedItems,
    "type",
    "Deposit"
  );

  const selectedTransfers = filterByStringAttribute(
    selectedItems,
    "type",
    "AccountTransfer"
  );

  const selectedFromTransfers = selectedTransfers.filter(
    ({isFromAccountItem}) => isFromAccountItem
  );
  const selectedToTransfers = selectedTransfers.filter(
    ({isToAccountItem}) => isToAccountItem
  );

  return {
    statement,
    items: getSortedItems(state),
    credits: [...credits, ...toTransfers],
    debits: [...debits, ...fromTransfers],
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
    selectedDebits: objectifyArray([
      ...selectedDebits,
      ...selectedFromTransfers,
    ]),
    selectedCredits: objectifyArray([
      ...selectedCredits,
      ...selectedToTransfers,
    ]),
    totalSelectedDebits: selectedCredits.length,
    totalSelectedCredits: selectedDebits.length,
    debitsOpen,
    creditsOpen,
    confirmationModal,
    statement_balance,
    clearedBalance,
    valid: isValid(statement),
  };
};

const mapDispatch = (dispatch, ownProps) => {
  const {route: {data: {bank_account: {slug} = {}} = {}} = {}} = ownProps;

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
        dispatch({type: "statement/resetStatement"});
        dispatch({type: "SET_STATEMENT_DATES", slug});
      } else {
        dispatch({type: "LOAD_STATEMENT", id});
      }
    },
    setStartDate: ({target: {value}}) => {
      setStartDate(value);
      dispatch({type: "FIND_BANK_ITEMS_BY_DATE", update: true});
    },
    setEndDate: ({target: {value}}) => {
      setEndDate(value);
      dispatch({type: "FIND_BANK_ITEMS_BY_DATE", update: true});
    },
    setStartingBalance: ({value}) => setStartingBalance(value),
    setEndingBalance: ({value}) => setEndingBalance(value),
    createSortHandler: (column) => () => setSortColumnAndDirection(column),
    createToggleItemHandler: (item) => (_event, selected) => {
      const {
        id,
        type,
        isFromAccountItem,
        isToAccountItem,
        amountInCents = "0",
      } = item;
      if (selected) {
        addSelectedItem({
          id,
          type,
          amountInCents,
          isFromAccountItem,
          isToAccountItem,
        });
      } else {
        removeSelectedItem({
          id,
          type,
          amountInCents,
          isFromAccountItem,
          isToAccountItem,
        });
      }
    },
    handleFileUrlChange: (url) => {
      setFileUrl(url);
    },
    createSubmitHandler: ({
      statement_id,
      bank_account_id,
      statement_balance,
      state_action,
    }) => (e) => {
      e.preventDefault();

      dispatch(
        saveStatement({
          statement_id,
          statementable_id: bank_account_id,
          statementable_type: "BankAccount",
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

// Export
//------------------------------------------------------------------------------
export default compose(
  ThemeWrapper,
  connect(mapStateToProps, mapDispatch),
  lifecycle({
    componentDidMount() {
      const {loadStatement} = this.props;
      loadStatement();

      const {account: {name, slug} = {}} = this.props;

      const [, , , , id = "new"] = window.location.pathname.split("/");
      const header = document.querySelector(".alt-breadcrumb");
      render(
        <Breadcrumb
          path={[
            {text: name, path: `/bank_accounts/${slug}/`},
            {
              text: "Reconciliations",
              path: `/bank_accounts/${slug}/reconciliations`,
            },
            {
              text: id,
              path: `/bank_accounts/${slug}/reconciliations/${id}`,
            },
          ]}
        />,
        header
      );
    },
  })
)(ShowPage);
