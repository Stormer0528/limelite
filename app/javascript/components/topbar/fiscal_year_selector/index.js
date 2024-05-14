import FiscalYearSelector from "./fiscal_year_selector";
import {compose} from "redux";
import {connect} from "react-redux";
import {graphql} from "react-apollo";

import gql from "graphql-tag";
import updateFiscalYearQuery from "@graphql/mutations/update_fiscal_year.gql";

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch, {mutate}) => {
  return {
    handleYearChange: async ({target: {value: year}}) => {
      await mutate({variables: {year}});
      window.location.reload();
    },
  };
};

export default compose(
  graphql(updateFiscalYearQuery, {}),
  connect(mapStateToProps, mapDispatchToProps)
)(FiscalYearSelector);
