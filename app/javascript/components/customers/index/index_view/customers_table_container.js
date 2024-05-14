import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import CustomersQuery from "../../../../graphql/queries/customers.gql";

// Components
//------------------------------------------------------------------------------
import CustomersTable from "./customers_table";

const mapStateToProps = (state, props) => {
  const {
    index_view: {customerFilter = {}},
  } = state;

  const {
    CustomersQuery: {
      customers = [],
      loading,
      // fetchMore = function() {},
      refetch = function () {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = {...customerFilter};
  if (!isEqual(filterVars, restVars)) {
    refetch({...filterVars});
  }

  return {
    loading,
    customers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default compose(
  graphql(CustomersQuery, {
    name: "CustomersQuery",
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(CustomersTable);
