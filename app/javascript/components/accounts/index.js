import {connect} from "react-redux";
import {compose} from "redux";
import {compact} from "lodash";
import DateWrapper from "../shared/date_wrapper";
import ThemeWrapper from "../shared/theme_wrapper";
import {serializeParams} from "../../utils";

// Components
import AccountIndexPage from "./index_page";

// Actions
import {
  findAccountByCode,
  setCurrentItemCode,
} from "../../actions/entry_actions";
import {createAccountFinderAccount} from "../../actions/account_finder_actions";

const mapStateToProps = ({
  accounts: {functions, funds, goals, locations, objects, resources, years},
  account_finder = {},
  account_finder: {
    loading,
    accounts = [],
    ui: {minimized},
    selected,
    selected: {
      name,
      fundId,
      functionId,
      goalId,
      locationId,
      resourceId,
      yearId,
    },
  },
}) => {
  const hasArgs =
    compact([name, fundId, functionId, goalId, locationId, resourceId, yearId])
      .length > 0;

  const paramString = serializeParams({filter: selected});
  return {
    loading,
    paramString,
    accounts,
    functions,
    funds,
    goals,
    hasArgs,
    locations,
    minimized,
    name,
    objects,
    resources,
    years,
    current_values: account_finder,
  };
};

const mapDispatchToProps = (dispatch) => {
  const {
    account_finder: {
      setName,
      setFundId,
      setFunctionId,
      setGoalId,
      setLocationId,
      setObjectId,
      setResourceId,
      setYearId,
      setFinderMinimized,
      toggleFinderMinimized,
    },
  } = dispatch;

  return {
    handleUpdateFund: ({target: {value}}) => {
      setFundId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateFunction: ({target: {value}}) => {
      setFunctionId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateGoal: ({target: {value}}) => {
      setGoalId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateLocation: ({target: {value}}) => {
      setLocationId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateObject: ({target: {value}}) => {
      setObjectId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateResource: ({target: {value}}) => {
      setResourceId(value);
      dispatch(findAccountByCode());
    },
    handleUpdateYear: ({target: {value}}) => {
      setYearId(value);
      dispatch(findAccountByCode());
    },
    handleSelectAccountCode: (code) => {
      dispatch(setCurrentItemCode(code));
    },
    handleCloseAccountFinder: () => {
      setFinderMinimized(true);
    },
    handleToggleAccountFinder: (e) => {
      e.stopPropagation();
      toggleFinderMinimized();
    },
    handleUpdateAccountName: ({target: {value}}) => {
      setName(value);
      dispatch(findAccountByCode());
    },
    handleCreateAccountClick: () => {
      dispatch(createAccountFinderAccount());
    },
  };
};

export default compose(
  ThemeWrapper,
  DateWrapper,
  connect(mapStateToProps, mapDispatchToProps)
)(AccountIndexPage);
