import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import InvoicesQuery from "../../../../graphql/queries/invoices.gql";

// Components
//------------------------------------------------------------------------------
import InvoicesTable from "../../index/index_view/invoices_table";

const mapStateToProps = (state, props) => {
  const {invoiceFilter: {filter = {}} = {}} = state;
  const {
    InvoicesQuery: {
      invoiceSearch: invoices = [],
      loading,
      // fetchMore = function() {},
      refetch = function() {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = {...filter, invoiceable_type: "Customer"};
  if (!isEqual(filterVars, restVars)) {
    refetch({...filterVars});
  }

  return {
    filter,
    loading,
    invoices,
  };
};

const mapDispatchToProps = dispatch => ({
  handleFilterCustomerIdChange: () => {},
  handleInvoiceFilterVendorNameChange: () => {},
  handleFilterVendorIdChange: () => {},
  handleInvoiceFilterStateChange: ({target: {value}}) => {
    dispatch.invoiceFilter.setStateFilter(value);
  },
  handleInvoiceFilterNumberChange: ({target: {value}}) => {
    dispatch.invoiceFilter.setNumberFilter(value);
  },
  handleInvoiceFilterPaidChange: (e, value) => {
    dispatch.invoiceFilter.setPaidFilter(value);
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
  },
});

export default compose(
  graphql(InvoicesQuery, {
    name: "InvoicesQuery",
    options: props => {
      const {vendor_id: invoiceable_id, account} = props;
      return {
        variables: {
          invoiceable_type: "Customer",
          invoiceable_id,
          account,
        },
      };
    },
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InvoicesTable);
