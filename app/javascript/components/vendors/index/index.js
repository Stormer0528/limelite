// Components
//------------------------------------------------------------------------------
import IndexView from "./index_view";
import {connect} from "react-redux";
import {compose} from "redux";

const mapStateToProps = (state) => {
  const {
    permissions = {},
    purchaseOrders = [],
    index_view: {
      ui: {tabIndex = 0},
      vendorFilter = {},
      invoiceFilter = {},
      batchUploadFilter = {},
    },
  } = state;

  return {
    purchaseOrders,
    tabIndex,
    vendorFilter,
    invoiceFilter,
    batchUploadFilter,
    permissions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleTabClick: (_e, value) => {
      dispatch.index_view.setTabIndex(value);
    },
    handleTabSwipe: (value) => {
      dispatch.index_view.setTabIndex(value);
    },
    createStateBtnHandler:
      (modelType) =>
      ({id, nextState}) =>
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: "TRANSITION_STATE",
          id,
          nextState,
          modelType,
          save: true,
        });
      },
    handleVendorFilterStateChange: ({target: {value}}) => {
      dispatch.index_view.setVendorStateFilter(value);
    },
    handleVendorFilterNumberChange: ({target: {value}}) => {
      dispatch.index_view.setVendorNumberFilter(value);
    },
    handleVendorFilterNameChange: ({target: {value}}) => {
      dispatch.index_view.setVendorNameFilter(value);
    },
    handleBatchUploadFilterStateChange: ({target: {value}}) => {
      dispatch.index_view.setBatchUploadStateFilter(value);
    },
    handleInvoiceFilterStateChange: ({target: {value}}) => {
      dispatch.index_view.setInvoiceStateFilter(value);
    },
    handleInvoiceFilterNumberChange: ({target: {value}}) => {
      dispatch.index_view.setInvoiceNumberFilter(value);
    },
    handleFilterVendorIdChange: (e, vendor) => {
      const {id} = vendor || {};
      dispatch.index_view.setVendorInvoiceableIdFilter(id);
    },
    handleInvoiceFilterPaidChange: (_e, value) => {
      dispatch.index_view.setInvoicePaidFilter(value);
    },
    handleInvoiceVoidChange: (_e, value) => {
      dispatch.index_view.setInvoiceVoidFilter(value);
    },
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(IndexView);
