import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
//------------------------------------------------------------------------------
import Spacer from "../../../page_elements/spacer";
import AccountStatus from "../../show_view/account_status";
import Statements from "./statements_container";
import NavLinks from "./navlinks";
import Fab from "./fab";

import {useCurrentRoute} from "react-navi";
import ReconciliationsIcon from "@material-ui/icons/CallToAction";

const IndexView = ({classes = {}}) => {
  const {
    data: {
      bank_account = {},
      bank_account: {slug: account_id} = {},
      bank_accounts: accounts = [],
    } = {},
  } = useCurrentRoute();

  return (
    <section className="BankAccount--StatementsIndex">
      <header className={classes.header}>
        <NavLinks {...{account_id, className: classes.navlinks}} />
        <h3 className={classes.pageHeader}>
          <ReconciliationsIcon className={classes.icon} />
          Bank&nbsp;Reconciliations
        </h3>
      </header>

      <AccountStatus {...{accounts, bank_account}} />
      <Spacer />
      <Statements {...{account_id}} />

      <Fab {...{account_id}} />
    </section>
  );
};

IndexView.propTypes = {
  accounts: PropTypes.array,
  bank_account: PropTypes.shape({
    slug: PropTypes.string,
    number: PropTypes.string,
    description: PropTypes.string,
    startedAt: PropTypes.string,
    endedAt: PropTypes.string,
    edpNumber: PropTypes.string,
    pseudo: PropTypes.string,
    accountObject: PropTypes.shape({
      code: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  statements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bank_account_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      started_at: PropTypes.string,
      ended_at: PropTypes.string,
      ending_balance: PropTypes.string,
      preparer: PropTypes.string,
      approver: PropTypes.string,
      approved: PropTypes.bool,
    })
  ),
  /* MUI Styles */
  classes: PropTypes.object,
};

const styles = (theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",

    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
    },
  },
  pageHeader: {
    order: -1,
    margin: "0 0 1rem",
    flexBasis: "10em",
    minWidth: "10em",
    display: "flex",
    alignItems: "center",
    flexGrow: 1,
    flexShrink: 1,

    [theme.breakpoints.down("sm")]: {
      order: 2,
      width: "100%",
      minWidth: "5em",
      flexBasis: "7.5em",
    },
  },
  icon: {
    marginRight: "1rem",
    width: "1.5em",
    height: "1.5em",
    color: "#455a64",
  },
});

export default withStyles(styles)(IndexView);
