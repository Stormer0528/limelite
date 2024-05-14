import VendorSelector from "./vendor_selector";
import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";

import VendorsQuery from "../../graphql/queries/vendors.gql";

const mapStateToProps = (state, props) => {
  const {vendorsQuery} = props;
  return {
    ...vendorsQuery,
  };
};

export default compose(
  graphql(VendorsQuery, {
    name: "vendorsQuery",
    options: {fetchPolicy: "network-only"},
  }),
  connect(mapStateToProps)
)(VendorSelector);
