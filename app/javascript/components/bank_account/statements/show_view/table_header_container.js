import {connect} from "react-redux";
import {withRouter} from "react-router";
import {formatNumber} from "humanize-plus";

// Actions
import {saveStatement} from "../../../../actions/statement_reducer_actions";

// Components
//------------------------------------------------------------------------------
import SearchBar from "./table_header";

const mapStateToProps = (
  {statement: {selectedItems = [], starting_balance}},
  {match: {params: {account_id, statement_id} = {}} = {}}
) => {
  const reconciled_balance = calcReconciledBalance(selectedItems);

  return {
    statement_id,
    bank_account_id: account_id,
    itemCount: selectedItems.length,
    reconciledBalance: `$${formatNumber(reconciled_balance, 2)}`,
    remainingBalance: calcRemainingBalance(
      starting_balance,
      reconciled_balance
    ),
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchBar)
);

// Helper Functions
function calcReconciledBalance(items = []) {
  return items.reduce((total, item) => {
    const {type, amount_in_cents} = item;
    if (type === "deposit") {
      return total + parseInt(amount_in_cents);
    }
    return total - parseInt(amount_in_cents);
  }, 0);
}

function calcRemainingBalance(staring_balance, remaining_balance) {
  const total = staring_balance - remaining_balance;
  return `$${formatNumber(total, 2)}`;
}
