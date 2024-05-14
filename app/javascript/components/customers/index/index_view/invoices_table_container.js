import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import InvoicesQuery from "../../../../graphql/queries/invoices.gql";

// Components
//------------------------------------------------------------------------------
import InvoicesTable from "./invoices_table";

const mapStateToProps = (state, props) => {
  const {
    filter = {},
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
    loading,
    invoices,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default compose(
  graphql(InvoicesQuery, {
    name: "InvoicesQuery",
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InvoicesTable);
