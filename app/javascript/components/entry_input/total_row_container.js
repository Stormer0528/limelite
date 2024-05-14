import TotalRow from "./total_row";
import {connect} from "react-redux";
import {isNil} from "lodash";
import {toggleFinalPayment} from "../../actions/entry_actions";

const mapStateToProps = ({
  payment: {finalPayment},
  entry: {entryItems: items},
}) => {
  return {finalPayment, total: calcAmount(items)};
};

const mapDipatchToProps = dispatch => {
  return {
    handleFinalPaymentClick: () => {
      dispatch(toggleFinalPayment());
    },
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(TotalRow);

// Helper Functions
//------------------------------------------------------------------------------------

export function calcAmount(entries = []) {
  return entries
    .filter(({type}) => type === "Credit")
    .filter(({amount}) => !isNil(amount))
    .map(({amount}) => amount)
    .reduce((total, amount) => total + amount, 0);
}
