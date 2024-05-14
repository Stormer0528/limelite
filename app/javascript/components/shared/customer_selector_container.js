import CustomerSelector from "./customer_selector";
import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";

import CustomersQuery from "../../graphql/queries/customers.gql";

const mapStateToProps = (state, props) => {
  const {customersQuery} = props;
  return {
    ...customersQuery,
  };
};

export default compose(
  graphql(CustomersQuery, {
    name: "customersQuery",
    options: {fetchPolicy: "network-only"},
  }),
  connect(mapStateToProps)
)(CustomerSelector);
