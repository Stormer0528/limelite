import {connect} from "react-redux";
import {compose} from "redux";
import {eventHandlers as DateHandlers} from "../../shared/date_range_toggle";
import {eventHandlers as AmountHandlers} from "../../shared/amount_toggle";

// Components
import Filter from "./credit_card_item_filter";

const mapStateToProps = (state) => {
  const {
    credit_card: {filter},
  } = state;

  return {...filter};
};

const mapDispatchToProps = (dispatch) => {
  const {
    credit_card: {
      setMemoFilter = function () {},
      setTypeFilter = function () {},
      setReconciledFilter = function () {},
      setVendorFilter = function () {},
      setStateFilter = function () {},
      // setNumberFilter = function() {},
      setUiDetailView = function () {},
    },
  } = dispatch;

  return {
    ...DateHandlers(dispatch, "credit_card"),
    /* handleFilterDateToggleChange, handleBeforeDateFilterChange, handleAfterDateFilterChange */
    ...AmountHandlers(dispatch, "credit_card"),
    /* handleFilterAmountToggleChange handleMaxAmountFilterChange handleMinAmountFilterChange */
    handleMemoChange: ({target: {value}}) => {
      setMemoFilter(value);
    },
    handleTypeChange: ({target: {value}}) => {
      setTypeFilter(value);
    },
    handleReconciledChange: (_e, value) => {
      setReconciledFilter(value);
    },
    handleStateChange: ({target: {value}}) => {
      setStateFilter(value);
    },
    handleVendorChange: (_e, vendor) => {
      const {id} = vendor || {};
      setVendorFilter(id);
    },
    handleToggleSetUiDetailView: ({target: {checked}}) => {
      setUiDetailView(!checked);
    },
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Filter);
