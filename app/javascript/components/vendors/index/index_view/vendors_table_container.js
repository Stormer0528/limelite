import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";
import isEqual from "lodash/isEqual";
import VendorsQuery from "../../../../graphql/queries/vendor_search.gql";

// Components
//------------------------------------------------------------------------------
import VendorsTable from "./vendors_table";

const mapStateToProps = (state, props) => {
  const {
    index_view: {vendorFilter = {}},
  } = state;

  const {
    VendorsQuery: {
      vendorSearch: vendors = [],
      loading,
      // fetchMore = function() {},
      refetch = function() {},
      variables: {cursor, first, ...restVars} = {},
    } = {},
  } = props;

  const filterVars = {...vendorFilter};
  if (!isEqual(filterVars, restVars)) {
    refetch({...filterVars});
  }
  return {
    loading,
    vendors,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default compose(
  graphql(VendorsQuery, {
    name: "VendorsQuery",
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(VendorsTable);
