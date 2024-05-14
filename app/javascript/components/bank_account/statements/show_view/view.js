import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {useCurrentRoute} from "react-navi";
import theme from "@shared/themes/statements_theme";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";
import TableHeader from "./table_header";
import ItemFilter from "./item_filter";
import ReconciliationPanel from "./reconciliation_panel";
import HeaderLinks from "./navlinks";
import Header from "./header";
import Footer from "./footer";
import ApprovalFooter from "./approval_footer";
import ConfirmationModal from "./confirmation_modal";
import {MuiThemeProvider} from "@material-ui/core/styles";

// Material UI
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import DebitIcon from "@material-ui/icons/MonetizationOn";
import CreditIcon from "@material-ui/icons/AttachMoney";

const ShowView = ({
  statement: {
    id: statement_id,
    started_at,
    ended_at,
    starting_balance,
    ending_balance,
    aasm_state,
    file_url,
    permissions,
    persisted = false,
    loading = false,
    audits = [],
  },
  sort = {},
  filter = {},
  items = {},
  itemCount,
  reconciledBalance,
  statement_balance,
  clearedBalance,
  aasm_action,
  remainingBalance,
  totalCredits = "$0.00",
  totalDebits = "$0.00",
  debitsOpen = true,
  creditsOpen = true,
  credits = [],
  debits = [],
  selectedCredits = {},
  selectedDebits = {},
  totalSelectedDebits = 0,
  totalSelectedCredits = 0,
  valid = false,
  confirmationModal = true,
  filestack = {},
  editable = false,
  classes = {},

  /* Callbacks */
  setStartDate = function () {},
  setEndDate = function () {},
  setStartingBalance = function () {},
  setEndingBalance = function () {},
  createSortHandler = function () {},
  createToggleItemHandler = function () {},
  handleFilterStartDateChange = function () {},
  handleFilterEndDateChange = function () {},
  handleFilterTypeChange = function () {},
  handleFilterNumberChange = function () {},
  handleFilterNameChange = function () {},
  handleFilterBtnClick = function () {},
  createSubmitHandler = function () {},
  handletoggleConfirmationModal = function () {},
  handleDebitsContainerClick = function () {},
  handleCreditsContainerClick = function () {},
  handleFileUrlChange = function () {},
}) => {
  const {
    data: {
      bank_account: account = {},
      bank_account: {name, slug: account_id} = {},
    } = {},
  } = useCurrentRoute();

  // Set readOnly for show page
  const readOnly = !editable || !location.href.match(/\/edit(\/)?$/);

  return (
    <MuiThemeProvider theme={theme}>
      <section
        className={clsx("Statements--ShowView react-inputs", classes.Paper)}
      >
        <HeaderLinks
          {...{account_id, account, persisted, statement_id, permissions}}
        />
        <Fade in={loading}>
          <LinearProgress className={classes.progress} />
        </Fade>

        <Header
          {...{
            name,
            file_url,
            started_at,
            filestack,
            ended_at,
            setStartDate,
            setEndDate,
            handleFileUrlChange,
            editable,
            readOnly,
          }}
        />

        <Paper>
          <TableHeader
            {...{
              starting_balance,
              ending_balance,
              setStartingBalance,
              setEndingBalance,
              handleFilterBtnClick,
              editable,
            }}
          />
          <Divider light />
          <Collapse in={filter.show}>
            <ItemFilter
              {...filter}
              handleStartDateChange={handleFilterStartDateChange}
              handleEndDateChange={handleFilterEndDateChange}
              handleFilterBtnClick={handleFilterBtnClick}
              handleTypeChange={handleFilterTypeChange}
              handleFilterNumberChange={handleFilterNumberChange}
              handleFilterNameChange={handleFilterNameChange}
            />
            <Divider light />
          </Collapse>
        </Paper>

        {/*  Credits  */}
        <ReconciliationPanel
          {...{
            title: "Deposits and Tansfers To",
            Icon: CreditIcon,
            sort,
            editable,
            items: credits,
            expanded: creditsOpen,
            itemTotal: totalCredits,
            itemCount: credits.length,
            selectedItems: selectedCredits,
            selectedItemsCount: totalSelectedDebits,
            createSortHandler,
            createToggleItemHandler,
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
            expanded: debitsOpen,
            itemTotal: totalDebits,
            itemCount: debits.length,
            selectedItems: selectedDebits,
            selectedItemsCount: totalSelectedCredits,
            createSortHandler,
            createToggleItemHandler,
            toggleExpanded: handleDebitsContainerClick,
            editable,
          }}
        />

        <ApprovalFooter
          {...{
            permissions,
            itemCount,
            totalItemCount: Object.values(items).length,
            starting_balance,
            ending_balance,
            reconciledBalance,
            remainingBalance,
            statement_balance,
            clearedBalance,
            createSubmitHandler,
            totalCredits,
            totalDebits,
            valid,
            aasm_state,
            audits,
            statement_id: statement_id,
            bank_account_id: account.id,
            handletoggleConfirmationModal,
          }}
        />

        <Footer
          {...{
            permissions,
            itemCount,
            totalItemCount: Object.values(items).length,
            starting_balance,
            ending_balance,
            reconciledBalance,
            remainingBalance,
            statement_balance,
            clearedBalance,
            createSubmitHandler,
            totalCredits,
            totalDebits,
            valid,
            aasm_state,
            statement_id: statement_id,
            bank_account_id: account.id,
            handletoggleConfirmationModal,
          }}
        />
        <ConfirmationModal
          {...{
            open: confirmationModal,
            createSubmitHandler,
            statement_balance,
            aasm_action,
            balance: remainingBalance,
            statement_id: statement_id,
            bank_account_id: account.id,
            handleModalClose: handletoggleConfirmationModal,
          }}
        />
      </section>
    </MuiThemeProvider>
  );
};

ShowView.propTypes = {
  reconciledBalance: PropTypes.string,
  remainingBalance: PropTypes.string,
  aasm_action: PropTypes.string,
  totalCredits: PropTypes.string,
  totalDebits: PropTypes.string,
  account: PropTypes.shape({
    name: PropTypes.string,
  }),
  statement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    started_at: PropTypes.string,
    ended_at: PropTypes.string,
    starting_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ending_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    aasm_state: PropTypes.string,
    file_url: PropTypes.string,
    permissions: PropTypes.object,
    persisted: PropTypes.bool,
    loading: PropTypes.bool,
    audits: PropTypes.arrayOf(PropTypes.object),
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
  loading: PropTypes.bool,
  editable: PropTypes.bool,
  debitsOpen: PropTypes.bool,
  creditsOpen: PropTypes.bool,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  itemCount: PropTypes.number,
  credits: PropTypes.array,
  debits: PropTypes.array,
  statement_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  clearedBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedCredits: PropTypes.object,
  selectedDebits: PropTypes.object,
  selectedCreditsitems: PropTypes.object,
  selectedDebitsitems: PropTypes.object,
  totalSelectedDebits: PropTypes.number,
  totalSelectedCredits: PropTypes.number,
  confirmationModal: PropTypes.bool,
  valid: PropTypes.bool,
  permissions: PropTypes.object,
  filestack: PropTypes.object,

  /* callbacks */
  setStartDate: PropTypes.func,
  setEndDate: PropTypes.func,
  setStartingBalance: PropTypes.func,
  setEndingBalance: PropTypes.func,
  createSortHandler: PropTypes.func,
  createSubmitHandler: PropTypes.func,
  createToggleItemHandler: PropTypes.func,
  handleDebitsContainerClick: PropTypes.func,
  handleCreditsContainerClick: PropTypes.func,
  handleFileUrlChange: PropTypes.func,
  handletoggleConfirmationModal: PropTypes.func,
  // Filter
  handleFilterStartDateChange: PropTypes.func,
  handleFilterEndDateChange: PropTypes.func,
  handleFilterBtnClick: PropTypes.func,
  handleFilterNameChange: PropTypes.func,
  handleFilterNumberChange: PropTypes.func,
  handleFilterTypeChange: PropTypes.func,

  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  progress: {
    left: "0",
    width: "100vw",
    right: "0",
    position: "fixed",
    top: "107px",
    height: "2px",
  },
  Paper: {
    paddingBottom: "200px",
  },
});

export default withStyles(styles)(ShowView);
