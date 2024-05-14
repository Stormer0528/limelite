import {connect} from "react-redux";
import {compose} from "redux";

// Components
//------------------------------------------------------------------------------
import IndexView from "./index_view";

const mapStateToProps = state => {
  const {
    // purchaseOrders = [],
    index_view: {
      ui: {tabIndex = 0},
      customerFilter = {},
      invoiceFilter = {},
    },
  } = state;

  return {
    // purchaseOrders,
    tabIndex,
    customerFilter,
    invoiceFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleTabClick: (_e, value) => {
      dispatch.index_view.setTabIndex(value);
    },
    createStateBtnHandler: modelType => ({id, nextState}) => e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({
        type: "TRANSITION_STATE",
        id,
        nextState,
        modelType,
        save: true,
      });
      window.location.reload();
    },
    handleCustomerFilterStateChange: ({target: {value}}) => {
      dispatch.index_view.setCustomerStateFilter(value);
    },
    handleCustomerFilterNumberChange: ({target: {value}}) => {
      dispatch.index_view.setCustomerNumberFilter(value);
    },
    handleCustomerFilterNameChange: ({target: {value}}) => {
      dispatch.index_view.setCustomerNameFilter(value);
    },
    handleInvoiceFilterStateChange: ({target: {value}}) => {
      dispatch.index_view.setInvoiceStateFilter(value);
    },
    handleInvoiceFilterNumberChange: ({target: {value}}) => {
      dispatch.index_view.setInvoiceNumberFilter(value);
    },
    handleInvoiceFilterCustomerNameChange: ({target: {value}}) => {
      dispatch.index_view.setInvoiceCustomerNameFilter(value);
    },
    handleInvoiceFilterPaidChange: (_e, value) => {
      dispatch.index_view.setInvoicePaidFilter(value);
    },
    handleFilterCustomerIdChange: ({target: {value}}) => {
      dispatch.index_view.setCustomerInvoiceableIdFilter(value);
    },
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(IndexView);
