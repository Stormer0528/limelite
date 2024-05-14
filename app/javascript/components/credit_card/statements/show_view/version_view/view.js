import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core";
import {useParams} from "react-router-dom";

import TableHeader from "../table_header";
import ReconciliationPanel from "./reconciliation_panel";
import HeaderLinks from "./navlinks";
import Header from "../header";
import Footer from "./footer";

// Material UI
import Paper from "@material-ui/core/Paper";
import DebitIcon from "@material-ui/icons/MonetizationOn";
import CreditIcon from "@material-ui/icons/AttachMoney";

const VersionShowView = ({
  statement: {
    id: statement_id,
    startedAt,
    endedAt,
    endingBalance,
    file_url,
    filestack = {},
    sort = {},
    selectedCredits = {},
    selectedDebits = {},
    permissions = {},
    account: {name} = {},
  } = {},
  credits = [],
  debits = [],
  totalCredits = "$0.00",
  totalDebits = "$0.00",
  clearedBalance = "$0.00",
  startingBalance = "$0.00",
  adjustmentAmount = "$0.00",
  handleCreditsContainerClick = function () {},
  handleDebitsContainerClick = function () {},
  debitsOpen = true,
  creditsOpen = true,
}) => {
  const classes = useStyles();
  const {account_id, version_id} = useParams();

  return (
    <section
      className={`Statements--VersionShowView react-inputs ${classes.root}`}
    >
      <HeaderLinks
        {...{
          account_id,
          statement_id,
          permissions,
        }}
      />

      <h4 className={classes.versionHeader}>Version {version_id}</h4>

      <Header
        {...{
          name,
          file_url,
          started_at: startedAt,
          filestack,
          ended_at: endedAt,
          readOnly: true,
          editable: true,
          hideFilestack: !file_url,
          handleFileUrlChange: function () {},
        }}
      />

      <Paper>
        <TableHeader
          {...{
            starting_balance: startingBalance,
            ending_balance: endingBalance,
            readOnly: true,
            editable: true,
          }}
        />
      </Paper>

      {/*  Credits  */}
      <ReconciliationPanel
        {...{
          title: "Deposits and Tansfers To",
          Icon: CreditIcon,
          sort,
          editable: false,
          items: credits,
          itemTotal: totalCredits,
          itemCount: credits.length,
          selectedItems: selectedCredits,
          expanded: creditsOpen,
          toggleExpanded: handleCreditsContainerClick,
        }}
      />

      {/*  Debits  */}
      <ReconciliationPanel
        {...{
          title: "Checks and Transfers From",
          Icon: DebitIcon,
          sort,
          items: debits,
          itemTotal: totalDebits,
          itemCount: debits.length,
          selectedItems: selectedDebits,
          editable: false,
          expanded: debitsOpen,
          toggleExpanded: handleDebitsContainerClick,
        }}
      />

      <Footer
        {...{
          startingBalance,
          endingBalance,
          totalCredits,
          totalDebits,
          clearedBalance,
          statementBalance: adjustmentAmount,
        }}
      />
    </section>
  );
};

VersionShowView.propTypes = {
  handleCreditsContainerClick: PropTypes.func.isRequired,
  handleDebitsContainerClick: PropTypes.func.isRequired,
  debitsOpen: PropTypes.bool,
  creditsOpen: PropTypes.bool,
  statement: PropTypes.object,
  credits: PropTypes.arrayOf(PropTypes.object),
  debits: PropTypes.arrayOf(PropTypes.object),
  totalCredits: PropTypes.string,
  totalDebits: PropTypes.string,
  clearedBalance: PropTypes.string,
  startingBalance: PropTypes.string,
  adjustmentAmount: PropTypes.string,
};

export default VersionShowView;

const useStyles = makeStyles({
  versionHeader: {
    margin: 0,
    background: "#2196F3",
    borderRadius: 3,
    paddingLeft: "1rem",
    color: "#fff",
    position: "fixed",
    width: "100vw",
    left: 0,
    top: 105,
    zIndex: 100,
  },
  root: {
    marginTop: 50,
    marginBottom: 50,
  },
});
