import EntrySelector from "./entry_selector";
import {connect} from "react-redux";
import {compose} from "redux";
import {graphql} from "react-apollo";

import InitialEntryQuery from "@graphql/queries/account_elements.gql";

const orderElements = (a, b) => {
  if (a.code > b.code) return 1;
  if (a.code < b.code) return -1;

  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;

  return 0;
}

const mapStateToProps = (_state, props) => {
  const { accountElements = {} } = props;
  const { funds = [], resources = [], years = [], goals = [], functions = [], objects = [], locations = [] } = accountElements;

  return {
    ...accountElements,
    funds: funds.sort(orderElements),
    resources: resources.sort(orderElements),
    years: years.sort(orderElements),
    goals: goals.sort(orderElements),
    functions: functions.sort(orderElements),
    objects: objects.sort(orderElements),
    locations: locations.sort(orderElements),
  };
};

export default compose(
  graphql(InitialEntryQuery, {name: "accountElements"}),
  connect(mapStateToProps)
)(EntrySelector);
