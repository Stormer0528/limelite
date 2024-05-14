import PropTypes from "prop-types";
import PopupBtn from "../../shared/popup_btn";
import Entry from "./entry_container";
import TableHeader from "./table_header";
import BankItemFilter from "./bank_item_filter";
import {USD} from "../../../utils";

// Default Cells
import SearchableTable from "../../searchable_table/searchable_table";
import ViewLinksRenderer from "../../searchable_table/components/defaults/view_links_renderer";
import DateCellRenderer from "../../searchable_table/components/defaults/date_column";
import TextCellRenderer from "../../searchable_table/components/defaults/advanced_text_column";

import {withStyles} from "@material-ui/core/styles";

const Ledger = ({
  fundCodes = [],
  loading = false,
  items = [],
  classes = {},
}) => {
  return (
    <TableHeader {...{classes, loading}}>
      <BankItemFilter />
      <SearchableTable
        data={items}
        listLength={items.length}
        headers={[
          "No.",
          "Date",
          "Payee",
          "Memo",
          "Entry",
          "Amount",
          ...fundCodes,
          "",
        ]}
        cells={[
          TextCellRenderer("node.number", {flexGrow: 0, columnWidth: 80}),
          DateCellRenderer("node.date"),
          TextCellRenderer("node.payee", {columnWidth: 120}),
          TextCellRenderer("node.memo", {flexGrow: 2, columnWidth: 120}),
          EntryColumn,
          TextCellRenderer("node.amount", {
            align: "right",
            format: text => {
              return text ? `$${text}` : "$0.00";
            },
            flexGrow: 0,
            columnWidth: 80,
          }),
          ...fundCodes.map(code => FundColumn(code)),
          ViewLinksRenderer({
            editPathProperty: "node.editPath",
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

// PropTypes
//------------------------------------------------------------------------------
Ledger.propTypes = {
  fundCodes: PropTypes.arrayOf(PropTypes.string),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        memo: PropTypes.string,
        number: PropTypes.string,
        date: PropTypes.string,
        payee: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      }),
    })
  ),
  loading: PropTypes.bool,
  fetchMore: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

// Styles
//------------------------------------------------------------------------------
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
    // fund columns]
    ["& .ReactVirtualized__Table__headerColumn:nth-child(n+6)"]: {
      textAlign: "right",
      marginRight: "0px",
      marginLeft: "0",
      justifyContent: "center",
      paddingRight: "16px",
    },
    ["& .ReactVirtualized__Table__rowColumn:nth-child(n+6)"]: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      marginRight: "0px",
      justifyContent: "stretch",
    },

    // column 11 [edit btn cell]

    ["& .ReactVirtualized__Table__rowColumn:nth-child(-n)"]: {
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

// Entry Column
//------------------------------------------------------------------------------
const debitStyles = {
  color: "#B71C1C",
  border: "2px solid #B71C1C",
  borderWidth: " 0 0 0 2px",
  display: "flex",
  justifyContent: "flex-end",
  paddingRight: ".5rem",
  alignItems: "center"
};

const creditStyles = {
  background: " #E8F5E9",
  color: " #388e3c",
  border: " 2px solid #388e3c",
  borderWidth: " 0 2px 0 0",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingRight: ".5rem",
};

const FundColumn = fundCode => ({
  rowData: {
    node: {entryItemsFundCodeTotals = "{}"},
  },
}) => {
  const fundCodes = JSON.parse(entryItemsFundCodeTotals);
  const currentFundCode = fundCodes[fundCode] || [0, 0];

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "stretch",
        width: "100%",
        gridTemplateColumns: "1fr",
        height: "100%",
        alignItems: "stretch",
      }}
    >
      <div style={debitStyles}>{USD(currentFundCode[0]).format()}</div>
    </div>
  );
};

const EntryColumn = ({
  rowData: {node: {entryId = false, path: itemPath, type: itemType} = {}} = {},
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

export default withStyles(styles)(Ledger);
