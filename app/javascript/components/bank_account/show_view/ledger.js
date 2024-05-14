import PropTypes from "prop-types";

import PopupBtn from "../../shared/popup_btn";
import Entry from "./entry_container";
import TableHeader from "./table_header";
import BankItemFilter from "./bank_item_filter";

// Material UI
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckIcon from "@material-ui/icons/OfflinePin";
import DepositIcon from "@material-ui/icons/AssignmentReturned";
import TransferIcon from "@material-ui/icons/CompareArrows";

// Default Cells
import ViewLinksRenderer from "../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../searchable_table/searchable_table";
import StateCellRenderer from "../../searchable_table/components/defaults/state_cell_renderer";
import DateCellRenderer from "../../searchable_table/components/defaults/date_column";
import TextCellRenderer from "../../searchable_table/components/defaults/text_column";
import {amountSearch} from "../../searchable_table/utils/search_functions";
import {creditCell, debitCell} from "../../new_entry_btn/entry_item";

import {withStyles} from "@material-ui/core/styles";
import {lowerCase} from "lodash";
import {titleCase} from "humanize-plus";

const Ledger = ({
  loading = false,
  storeKey = "account_show_ledger",
  print_path = "./print",
  xlsx_path,
  items = [],
  classes = {},
  filter = {},
  account,
  ui: {ledgerView = "detail"} = {},
  handleToggleSetUiDetailView,
  handleReconciledChange,
  handleFilterDateToggleChange,
  handleBeforeDateFilterChange,
  handleAfterDateFilterChange,
  handleMemoChange,
  handleTypeChange,
  handleStateChange,
  handleVendorChange,
  handleFilterAmountToggleChange,
  handleMaxAmountFilterChange,
  handleMinAmountFilterChange,
  handleNumberChange,
}) => {
  return (
    <TableHeader
      {...{
        account,
        print_path,
        xlsx_path,
        classes,
        loading,
        ledgerView,
        handleToggleSetUiDetailView,
      }}
    >
      <BankItemFilter
        {...filter}
        {...{
          vendors: account.vendors,
          handleReconciledChange,
          handleFilterDateToggleChange,
          handleBeforeDateFilterChange,
          handleAfterDateFilterChange,
          handleMemoChange,
          handleTypeChange,
          handleStateChange,
          handleVendorChange,
          handleFilterAmountToggleChange,
          handleMaxAmountFilterChange,
          handleMinAmountFilterChange,
          handleNumberChange,
        }}
      />

      <SearchableTable
        data={items}
        listLength={items.length}
        storeKey={storeKey}
        headers={[
          "Type",
          "State",
          "No.",
          "Date",
          "Payee",
          "Memo",
          "Entry",
          "Cleared",
          "Debits",
          "Credits",
          "",
        ]}
        cells={[
          TypeColumn,
          StateCellRenderer("aasmState", {columnWidth: 90}),
          NumberColumn,
          DateCellRenderer("date"),
          "payee",
          "memo",
          EntryColumn,
          ReconciledColumn,
          DebitColumn,
          CreditColumn,
          ViewLinksRenderer({
            editPathProperty: "editPath",
            showView: false,
            showDelete: false,
            columnWidth: 35,
            flexGrow: 0,
            target: "_blank",
          }),
        ]}
      />
    </TableHeader>
  );
};

// TYPE COLUMN
//------------------------------------------------------------------------------
const TypeColumn = ({rowData: {path = "", type = ""}}) => {
  return (
    <div>
      <a href={path} target="_blank" rel="noopener noreferrer">
        {type === "Check" && (
          <CheckIcon
            fontSize="small"
            style={{top: ".25em", position: "relative"}}
          />
        )}
        {type === "Deposit" && (
          <DepositIcon
            fontSize="small"
            style={{top: ".25em", position: "relative"}}
          />
        )}
        {type === "AccountTransfer" && (
          <TransferIcon
            fontSize="small"
            style={{top: ".25em", position: "relative"}}
          />
        )}
        {"  "}
        {`${titleCase(lowerCase(type))}`}
      </a>
    </div>
  );
};

TypeColumn.disableSort = false;
TypeColumn.column = "type";
TypeColumn.columnWidth = 85;
TypeColumn.flexGrow = 0;

TypeColumn.propTypes = {
  rowData: PropTypes.shape({
    type: PropTypes.string,
    path: PropTypes.string,
  }),
};

// TYPE COLUMN
//------------------------------------------------------------------------------
const NumberColumn = TextCellRenderer("number", {flexGrow: 0, columnWidth: 80});
NumberColumn.columnWidth = 85;
NumberColumn.flexGrow = 0;

// Debit COLUMN
//------------------------------------------------------------------------------
const DebitColumn = ({rowData: {debit}}) => {
  return <div style={debitCellStyle}>{debit}</div>;
};

DebitColumn.propTypes = {
  rowData: PropTypes.shape({
    debit: PropTypes.string,
  }),
};

DebitColumn.disableSort = false;
DebitColumn.column = "debit";
DebitColumn.customSortFunc = amountSearch("debit");

// Credit COLUMN
//------------------------------------------------------------------------------
const CreditColumn = ({rowData: {credit}}) => {
  return <div style={creditCellStyle}>{credit}</div>;
};

CreditColumn.propTypes = {
  rowData: PropTypes.shape({
    credit: PropTypes.string,
  }),
};

CreditColumn.disableSort = false;
CreditColumn.column = "credit";
CreditColumn.customSortFunc = amountSearch("credit");

// RECONCILED COLUMN
//------------------------------------------------------------------------------
const ReconciledColumn = ({rowData: {reconciled}}) => {
  return reconciled ? (
    <div className="green-text center-align">
      <CheckCircleIcon />
    </div>
  ) : (
    <div />
  );
};

ReconciledColumn.columnWidth = 85;

ReconciledColumn.propTypes = {
  rowData: PropTypes.shape({
    reconciled: PropTypes.bool,
  }),
};

// Entry Column
//------------------------------------------------------------------------------
const EntryColumn = ({
  rowData: {entryId = false, path: itemPath, type: itemType},
}) => {
  if (!entryId) {
    return <div />;
  }

  return (
    <PopupBtn
      text="Entry"
      popupProps={{
        PaperProps: {
          style: {
            width: "75vw",
          },
        },
      }}
    >
      <Entry {...{entryId, itemPath, itemType}} />
    </PopupBtn>
  );
};

EntryColumn.propTypes = {
  rowData: PropTypes.shape({
    entryId: PropTypes.string,
    path: PropTypes.string,
    type: PropTypes.string,
    entry: PropTypes.object,
  }),
};

EntryColumn.disableSort = true;
EntryColumn.columnWidth = 75;
EntryColumn.flexGrow = 0;

// PropTypes
//------------------------------------------------------------------------------
Ledger.propTypes = {
  storeKey: PropTypes.string,
  print_path: PropTypes.string,
  xlsx_path: PropTypes.string,
  account: PropTypes.shape({
    balance: PropTypes.string,
    startingBalance: PropTypes.string,
    lastMonthBalance: PropTypes.string,
  }),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      credit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      debit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  loading: PropTypes.bool,
  filter: PropTypes.object,
  ui: PropTypes.object,
  classes: PropTypes.object.isRequired,
  handleFilterAmountToggleChange: PropTypes.func.isRequired,
  handleMaxAmountFilterChange: PropTypes.func.isRequired,
  handleMinAmountFilterChange: PropTypes.func.isRequired,
  handleFilterDateToggleChange: PropTypes.func.isRequired,
  handleBeforeDateFilterChange: PropTypes.func.isRequired,
  handleAfterDateFilterChange: PropTypes.func.isRequired,
  handleToggleSetUiDetailView: PropTypes.func.isRequired,
  handleReconciledChange: PropTypes.func.isRequired,
  handleMemoChange: PropTypes.func.isRequired,
  handleTypeChange: PropTypes.func.isRequired,
  handleStateChange: PropTypes.func.isRequired,
  handleVendorChange: PropTypes.func.isRequired,
  handleNumberChange: PropTypes.func.isRequired,
};

// Styles
//------------------------------------------------------------------------------
const baseAmount = {
  height: "100%",
  width: "100%",
  padding: ".5em 0.25em",
  flex: "1 0 100%",
  display: "inline-flex",
  placeContent: "center flex-end",
};

const creditCellStyle = Object.assign({}, baseAmount, creditCell, {
  borderWidth: "0 2px 0 1px",
});
const debitCellStyle = Object.assign({}, baseAmount, debitCell, {
  borderWidth: "0 1px 0 2px",
});

const styles = theme => ({
  root: {
    flexBasis: " 500px",
    minHeight: "250px",
    flex: "auto",
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 135px)",
    marginTop: "0.75em",

    // COLUMN HEADERS
    //--------------------------------------------------------------------------
    // column headers 1-6
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn:nth-child(-n+6)"]: {
      paddingLeft: 0,
    },

    // column header 7 [Entry]
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn:nth-child(7)"]: {
      textAlign: "center",
      margin: "0 5px 0 5px",
    },

    // column header 8 [Cleared]
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn:nth-child(8)"]: {
      textAlign: "center",
      marginLeft: "5px",
      marginRight: "5px",
    },

    // column header 9, 10 [credits/debits]
    ["& .ReactVirtualized__Table__headerColumn:nth-child(9)"]: {
      paddingLeft: "10px",
    },
    ["& .ReactVirtualized__Table__headerColumn:nth-child(n+10)"]: {
      paddingLeft: 0,
    },

    // column header 11 [edit btn]
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn:last-child"]: {
      marginLeft: 0,
    },

    // COLUMNS
    //--------------------------------------------------------------------------
    // columns 7, 8 [entry/cleared]
    ["& .ReactVirtualized__Table__rowColumn:nth-child(7)"]: {
      justifyContent: "center",
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(8)"]: {
      justifyContent: "center",
    },
    // Debit Column
    ["& .ReactVirtualized__Table__rowColumn:nth-child(9)"]: {
      marginRight: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "stretch",
      height: "100%",

      "& > div": {
        textAlign: "right",
      },
    },
    // Credit Column
    ["& .ReactVirtualized__Table__rowColumn:nth-child(10)"]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "stretch",
      height: "100%",

      "& > div": {
        textAlign: "right",
      },
    },

    // column 11 [edit btn cell]
    ["& .ReactVirtualized__Table__rowColumn:nth-child(11)"]: {
      justifyContent: "center",
    },
  },
  header: {
    padding: `.5em ${theme.spacing(1)}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    color: "#546E7A",

    ["& b"]: {
      color: "#607D8B",
    },
  },
  ledgerText: {
    fontSize: "1.75em",
    lineHeight: "1.25em",
    flexGrow: 2,
  },
  chip: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #CFD8DC",
  },
});

export default withStyles(styles)(Ledger);
