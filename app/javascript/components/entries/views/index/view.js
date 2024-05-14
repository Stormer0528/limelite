import PropTypes from "prop-types";
import DetailTable from "./detail_table";
import SummaryTable from "./summary_table";
import {withStyles} from "@material-ui/core/styles";

// Material UI
import EntryIcon from "@material-ui/icons/Receipt";
import DetailFilter from "./detail_filter";
import SummaryFilter from "./summary_filter";
import TableHeader from "../table_header";

import AccountFinder from "../../../reports/shared/entry_selector_container";

import PdfIcon from "mdi-react/FilePdfIcon";
import ExcelIcon from "mdi-react/FileTableOutlineIcon";

const IndexView = ({
  print_path = "",
  xlsx_path = "",
  classes = {},
  filter,
  filter: {account},
  ui = {},
  entries = [],
  items = [],
  loading = false,
  handleFilterDateToggleChange = function () {},
  handleAccountFundChange = function () {},
  handleAccountResourceChange = function () {},
  handleAccountYearChange = function () {},
  handleAccountGoalChange = function () {},
  handleAccountFunctionChange = function () {},
  handleAccountObjectChange = function () {},
  handleAccountLocationChange = function () {},
  handleTypeFilterChange = function () {},
  handleEntryTypeFilterChange = function () {},
  handleMemoFilterChange = function () {},
  handleJournalTypeFilterChange = function () {},
  handleStateFilterChange = function () {},
  handleBeforeDateFilterChange = function () {},
  handleAfterDateFilterChange = function () {},
  handleToggleSetUiDetailView = function () {},
  handleFilterAmountToggleChange = function () {},
  handleMaxAmountFilterChange = function () {},
  handleMinAmountFilterChange = function () {},
}) => {
  return (
    <TableHeader
      detailSwitch
      {...ui}
      {...{
        title: "General Ledger",
        TitleIcon: EntryIcon,
        PrintIcon: PdfIcon,
        ExcelIcon: ExcelIcon,
        printPath: print_path,
        xlsxPath: xlsx_path,
        loading,
        ledgerView: ui.ledgerView,
        handleToggleSetUiDetailView,
      }}
    >
      {ui.ledgerView === "detail" && (
        <DetailFilter
          {...{
            ...filter,
            handleFilterDateToggleChange,
            handleEntryTypeFilterChange,
            handleJournalTypeFilterChange,
            handleStateFilterChange,
            handleBeforeDateFilterChange,
            handleAfterDateFilterChange,
            handleFilterAmountToggleChange,
            handleMaxAmountFilterChange,
            handleMinAmountFilterChange,
            handleMemoFilterChange,
          }}
        />
      )}

      {ui.ledgerView === "summary" && (
        <SummaryFilter
          {...{
            ...filter,
            handleFilterDateToggleChange,
            handleTypeFilterChange,
            handleEntryTypeFilterChange,
            handleJournalTypeFilterChange,
            handleStateFilterChange,
            handleBeforeDateFilterChange,
            handleAfterDateFilterChange,
            handleFilterAmountToggleChange,
            handleMaxAmountFilterChange,
            handleMinAmountFilterChange,
            handleMemoFilterChange,
          }}
        />
      )}

      <AccountFinder
        showHelp
        {...{
          handleAccountFundChange,
          handleAccountResourceChange,
          handleAccountYearChange,
          handleAccountGoalChange,
          handleAccountFunctionChange,
          handleAccountObjectChange,
          handleAccountLocationChange,
          classes: {
            root: classes.accountFilter,
          },
          ...account,
        }}
      />

      {ui.ledgerView === "summary" && <SummaryTable {...{loading, items}} />}
      {ui.ledgerView === "detail" && <DetailTable {...{loading, entries}} />}
    </TableHeader>
  );
};

IndexView.propTypes = {
  entries: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  items: PropTypes.array,
  loading: PropTypes.bool,
  print_path: PropTypes.string,
  xlsx_path: PropTypes.string,
  classes: PropTypes.object.isRequired,
  filter: PropTypes.object,
  ui: PropTypes.object,
  handleFilterDateToggleChange: PropTypes.func.isRequired,
  handleAccountFundChange: PropTypes.func.isRequired,
  handleAccountResourceChange: PropTypes.func.isRequired,
  handleAccountYearChange: PropTypes.func.isRequired,
  handleAccountGoalChange: PropTypes.func.isRequired,
  handleAccountFunctionChange: PropTypes.func.isRequired,
  handleAccountObjectChange: PropTypes.func.isRequired,
  handleAccountLocationChange: PropTypes.func.isRequired,
  handleTypeFilterChange: PropTypes.func.isRequired,
  handleEntryTypeFilterChange: PropTypes.func.isRequired,
  handleJournalTypeFilterChange: PropTypes.func.isRequired,
  handleStateFilterChange: PropTypes.func.isRequired,
  handleBeforeDateFilterChange: PropTypes.func.isRequired,
  handleAfterDateFilterChange: PropTypes.func.isRequired,
  handleToggleSetUiDetailView: PropTypes.func.isRequired,
  handleMemoFilterChange: PropTypes.func.isRequired,
  handleFilterAmountToggleChange: PropTypes.func.isRequired,
  handleMaxAmountFilterChange: PropTypes.func.isRequired,
  handleMinAmountFilterChange: PropTypes.func.isRequired,
};

const styles = () => ({
  root: {
    flexBasis: " 500px",
    minHeight: "250px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  accountFilter: {
    margin: 0,
  },
});

export default withStyles(styles)(IndexView);
