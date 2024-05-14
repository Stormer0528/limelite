import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import AccountFinder from "./account_finder";
import AccountModal from "./account_modal/account_modal";
import {NewAccountModalProvider} from "./account_modal/context";
import AccountsViewTable from "./accounts_view_table";
import IndexPageHeader from "./index_page_header";

import ACCOUNTS_QUERY from "../../graphql/queries/account_search_connection_with_budget.gql";

const AccountIndexPage = ({defaultState = {}, classes = {}}) => {
  return (
    <NewAccountModalProvider>
      <div className={`AccountFinderRow ${classes.container}`}>
        <AccountFinder
          {...{
            classes: {
              root: classes.AccountFinderRoot,
              SummaryRoot: classes.SummaryRoot,
              DetailsRoot: classes.DetailsRoot,
            },
            SearchbarProps: {
              classes: {
                outlinedInput: classes.outlinedInput,
              },
            },
            minimized: false,
            QUERY: ACCOUNTS_QUERY,
            scoped: true,
            defaultState,
            AccountsTableComponent: AccountsViewTable,
            HeaderBtns: IndexPageHeader,
          }}
        />
        <AccountModal />
      </div>
    </NewAccountModalProvider>
  );
};

AccountIndexPage.propTypes = {
  defaultState: PropTypes.object,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  container: {
    position: "relative",
  },
  AccountFinderRoot: {
    background: "transparent",
    border: "none",
  },
  SummaryRoot: {
    background: "#f5f5f5",
    border: "1px solid #f5f5f5",
  },
  outlinedInput: {
    " & input": {
      paddingTop: "10.5px",
      paddingLeft: "8px",
    },
  },
});

export default withStyles(styles)(AccountIndexPage);
