import InvoicesQuery from "../../../../graphql/queries/invoices.gql";
// Components
//------------------------------------------------------------------------------
import InvoicesTable from "./invoices_table";
import isEqual from "lodash/isEqual";
import {graphql} from "react-apollo";
import {connect} from "react-redux";
import {compose} from "redux";

const mapStateToProps = (state, props) => {
  const {
    filter = {},
    InvoicesQuery: {
      invoiceSearch: invoices = [],
      loading,

      refetch = function () {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = {...filter, invoiceable_type: "Vendor"};
  if (!isEqual(filterVars, restVars)) {
    refetch({...filterVars});
  }

  return {
    loading,
    invoices,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default compose(
  graphql(InvoicesQuery, {
    name: "InvoicesQuery",
    options: (props) => {
      return {
        variables: {
          invoiceable_type: "Vendor",
          paid: false,
          voided: false,
        },
      };
    },
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(InvoicesTable);
