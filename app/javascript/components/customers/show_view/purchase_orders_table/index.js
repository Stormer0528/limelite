import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import PurchaseOrderQuery from "../../../../graphql/queries/purchase_orders.gql";

// Components
//------------------------------------------------------------------------------
import InvoicesTable from "./table";

const mapStateToProps = (state, props) => {
  const {purchseOrderFilter: {filter = {}} = {}} = state;

  const {
    PurchaseOrderQuery: {
      purchaseOrderSearch: purchaseOrders = [],
      loading,
      // fetchMore = function() {},
      refetch = function() {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = {...filter};
  if (!isEqual(filterVars, restVars)) {
    refetch({...filterVars});
  }
  return {
    filter,
    loading,
    purchaseOrders,
  };
};

const mapDispatchToProps = dispatch => ({
  handleFilterNumberChange: ({target: {value}}) => {
    dispatch.purchseOrderFilter.setNumberFilter(value);
  },
  handleFilterInvoiceNumberChange: ({target: {value}}) => {
    dispatch.purchseOrderFilter.setInvoiceNumberFilter(value);
  },
});

export default compose(
  graphql(PurchaseOrderQuery, {
    name: "PurchaseOrderQuery",
    options: props => {
      const {vendor_id, account} = props;
      return {
        variables: {
          vendor_id,
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
