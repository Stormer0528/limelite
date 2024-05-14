import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {Helmet} from "react-helmet";

import TableHeader from "../../bank_account/statements/show_view/table_header";
import ItemFilter from "../../bank_account/statements/show_view/item_filter";
import ReconciliationPanel from "./reconciliation_panel";
import HeaderLinks from "./navlinks";
import Header from "./header";
import Footer from "./footer";

// Material UI
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import DebitIcon from "@material-ui/icons/MonetizationOn";
import CreditIcon from "@material-ui/icons/AttachMoney";

const ShowView = ({
  statement: {
    id: statement_id,
    startedAt: started_at,
    endedAt: ended_at,
    startingBalance: starting_balance,
    endingBalance: ending_balance,
    aasmState: aasm_state,
    fileUrl: file_url,
    exportPath,
    permissions,
    statementable: {name},
  },
  sort = {},
  filter = {},
  selectedCreditsCount,
  selectedDebitsCount,
  reconciledBalance,
  statementBalance,
  clearedBalance,
  remainingBalance,
  totalCredits = "$0.00",
  totalDebits = "$0.00",
  credits = [],
  debits = [],
  selectedItems = {},
  filestack = {},
}) => {
  return (
    <section className="Statements--ShowView react-inputs">
      <Helmet>
        <title>
          LimeLite DS :: Statements &raquo; {name} &raquo; {statement_id}{" "}
        </title>
      </Helmet>

      <HeaderLinks {...{statement_id, permissions, exportPath}} />
      <Header
        {...{
          name,
          file_url,
          started_at,
          filestack,
          ended_at,
          editable: false,
          show: true,
        }}
      />

      <Paper>
        <TableHeader
          {...{
            starting_balance,
            ending_balance,
            editable: false,
          }}
        />
        <Divider light />
        <Collapse in={filter.show}>
          <ItemFilter {...filter} />
          <Divider light />
        </Collapse>
      </Paper>

      {/*  Credits  */}
      <ReconciliationPanel
        {...{
          title: "Deposits and Tansfers To",
          Icon: CreditIcon,
          sort,
          items: credits,
          itemTotal: totalCredits,
          itemCount: credits.length,
          selectedItems,
          selectedItemsCount: selectedCreditsCount,
          editable: false,
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
          selectedItems,
          selectedItemsCount: selectedDebitsCount,
          editable: false,
        }}
      />

      <Footer
        {...{
          permissions,
          starting_balance,
          ending_balance: Number(ending_balance.replace(/[,$]/gi, "")),
          reconciledBalance,
          remainingBalance,
          statement_balance: statementBalance,
          clearedBalance,
          createSubmitHandler: function () {},
          totalCredits,
          totalDebits,
          valid: true,
          aasm_state,
          statement_id: statement_id,
          handletoggleConfirmationModal: function () {},
        }}
      />
    </section>
  );
};

ShowView.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
  }),
  aasm_action: PropTypes.string,
  reconciledBalance: PropTypes.string,
  remainingBalance: PropTypes.string,
  selectedCreditsCount: PropTypes.number,
  selectedDebitsCount: PropTypes.number,
  totalCredits: PropTypes.string,
  totalDebits: PropTypes.string,

  statement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    aasmState: PropTypes.string,
    endedAt: PropTypes.string,
    endingBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    exportPath: PropTypes.string,
    fileUrl: PropTypes.string,
    loading: PropTypes.bool,
    permissions: PropTypes.object,
    persisted: PropTypes.bool,
    startedAt: PropTypes.string,
    startingBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    statementable: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
    }),
  }),

  filter: PropTypes.shape({
    type: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    memo: PropTypes.string,
  }),

  sort: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.string,
  }),

  clearedBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  confirmationModal: PropTypes.bool,
  credits: PropTypes.array,
  creditsOpen: PropTypes.bool,
  debits: PropTypes.array,
  debitsOpen: PropTypes.bool,
  editable: PropTypes.bool,
  filestack: PropTypes.object,
  itemCount: PropTypes.number,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  loading: PropTypes.bool,
  permissions: PropTypes.object,
  selectedCredits: PropTypes.object,
  selectedCreditsitems: PropTypes.object,
  selectedDebits: PropTypes.object,
  selectedDebitsitems: PropTypes.object,
  selectedItems: PropTypes.object,
  statement_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  statementBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalSelectedCredits: PropTypes.number,
  totalSelectedDebits: PropTypes.number,
  valid: PropTypes.bool,

  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  progress: {
    left: "0",
    width: "100vw",
    right: "0",
    position: "fixed",
    top: "107px",
    height: "2px",
  },
});

export default withStyles(styles)(ShowView);
