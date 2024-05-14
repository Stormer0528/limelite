import PropTypes from "prop-types";
import {withStyles} from "@material-ui/styles";
import {MuiThemeProvider} from "@material-ui/core/styles";
import theme from "@shared/themes/statements_theme";
import {Helmet} from "react-helmet";

// Material UI
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import DebitIcon from "@material-ui/icons/MonetizationOn";
import CreditIcon from "@material-ui/icons/AttachMoney";

import Header from "./header";
import Navlinks from "./navlinks";
import ConfirmationModal from "./confirmation_modal";
import ApprovalFooter from "@components/bank_account/statements/show_view/approval_footer";
import Footer from "@components/bank_account/statements/show_view/footer";
import ReconciliationPanel from "./reconciliation_panel";
import ItemFilter from "./item_filter";
import TableHeader from "./table_header";
import Breadcrumb from "../../breadcrumb";

import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/react-hooks";

import CREDIT_CARD_QUERY from "@graphql/queries/load_credit_card.gql";

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
  const {account_id: slug} = useParams();
  const {loading: accountLoading, data: {account = {}} = {}} = useQuery(
    CREDIT_CARD_QUERY,
    {
      variables: {slug},
    }
  );

  if (accountLoading) {
    return null;
  }

  // Set readOnly for show page
  const readOnly =
    !editable ||
    (!location.href.match(/\/edit(\/)?$/) &&
      !location.href.match(/\/new(\/)?$/));

  return (
    <MuiThemeProvider theme={theme}>
      <section className="Statements--ShowView react-inputs">
        <Helmet>
          <title>{`LimeLite DS :: Credit Cards > ${
            slug || ""
          } > Reconciliation`}</title>
        </Helmet>
        <Breadcrumb />

        <Navlinks {...{account, permissions, statement_id}} />
        <Header
          {...{
            name: account.name,
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
              readOnly,
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
            title: "Payments",
            Icon: CreditIcon,
            sort,
            items: credits,
            expanded: creditsOpen,
            itemTotal: totalCredits,
            itemCount: credits.length,
            selectedItems: selectedCredits,
            selectedItemsCount: totalSelectedDebits,
            createSortHandler,
            createToggleItemHandler,
            toggleExpanded: handleCreditsContainerClick,
            editable,
            readOnly,
          }}
        />

        {/*  Debits  */}
        <ReconciliationPanel
          {...{
            title: "Charges",
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
            readOnly,
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
            statement_id,
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
            statement_id,
            credit_card_id: account.id,
            bank_account_id: account.id,
            handleModalClose: handletoggleConfirmationModal,
          }}
        />
      </section>
    </MuiThemeProvider>
  );
};

ShowView.propTypes = {
  aasm_action: PropTypes.string,
  reconciledBalance: PropTypes.string,
  remainingBalance: PropTypes.string,
  totalCredits: PropTypes.string,
  totalDebits: PropTypes.string,
  account: PropTypes.shape({
    name: PropTypes.string,
  }),
  statement: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    aasm_state: PropTypes.string,
    audits: PropTypes.arrayOf(PropTypes.object),
    ended_at: PropTypes.string,
    ending_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    file_url: PropTypes.string,
    started_at: PropTypes.string,
    starting_balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    persisted: PropTypes.bool,
    permissions: PropTypes.shape({
      show: PropTypes.bool,
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
  filestack: PropTypes.object,
  itemCount: PropTypes.number,
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  permissions: PropTypes.object,
  selectedCredits: PropTypes.object,
  selectedCreditsitems: PropTypes.object,
  selectedDebits: PropTypes.object,
  selectedDebitsitems: PropTypes.object,
  statement_balance: PropTypes.number,
  totalSelectedCredits: PropTypes.number,
  totalSelectedDebits: PropTypes.number,
  valid: PropTypes.bool,
  editable: PropTypes.bool,
  /* callbacks */
  createSortHandler: PropTypes.func.isRequired,
  createSubmitHandler: PropTypes.func.isRequired,
  createToggleItemHandler: PropTypes.func.isRequired,
  handleCreditsContainerClick: PropTypes.func.isRequired,
  handleDebitsContainerClick: PropTypes.func.isRequired,
  handleFileUrlChange: PropTypes.func.isRequired,
  handletoggleConfirmationModal: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  setEndingBalance: PropTypes.func.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setStartingBalance: PropTypes.func.isRequired,
  // Filter
  handleFilterBtnClick: PropTypes.func.isRequired,
  handleFilterEndDateChange: PropTypes.func.isRequired,
  handleFilterNameChange: PropTypes.func.isRequired,
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterStartDateChange: PropTypes.func.isRequired,
  handleFilterTypeChange: PropTypes.func.isRequired,
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
});

export default withStyles(styles)(ShowView);
