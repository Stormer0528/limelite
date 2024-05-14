import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SearchableTable from "../searchable_table/searchable_table";
import StateCellRenderer from "../searchable_table/components/defaults/state_cell_renderer";
import LinkRenderer from "../searchable_table/components/defaults/link_renderer";
import DateRenderer from "../searchable_table/components/defaults/date_column";
import {
  textSearch,
  amountSearch,
} from "../searchable_table/utils/search_functions";
import {creditCell, debitCell} from "../new_entry_btn/entry_item";
import EntryTableFilter from "./entries_table/entries_table_filter_container";
import EntryModalBtn from "../shared/entry_modal/entry_modal_btn";

const EntriesTable = ({entries = [], classes = {}}) => {
  return (
    <Paper className={classes.root}>
      <EntryTableFilter />
      <SearchableTable
        data={entries}
        headers={["Type", "Date", "State", "Memo", "Entry", "Debit", "Credit"]}
        cells={[
          LinkRow,
          DateRenderer("date"),
          StateCellRenderer("aasmState", {flexGrow: 0}),
          "memo",
          EntryColumn,
          DebitRow,
          CreditRow,
        ]}
      />
    </Paper>
  );
};

EntriesTable.propTypes = {
  entries: PropTypes.array,
  classes: PropTypes.object,
};

// Styles
//------------------------------------------------------------------------------
const baseAmount = {
  flex: "1 0 100%",
  display: "inline-flex",
  justifyContent: "flex-end",
  alignContent: "flex-end",
  alignItems: "center",
  padding: "0.25em",
};

const creditCellStyle = Object.assign({}, baseAmount, creditCell);
const debitCellStyle = Object.assign({}, baseAmount, debitCell);

const styles = () => ({
  root: {
    height: "100%",
    width: "100%",

    ["& h5"]: {
      fontSize: "1.15em",
    },
    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn"]:
      {
        marginRight: 0,
      },
    ["& .ReactVirtualized__Table__rowColumn"]: {
      height: "100%",
      width: "100%",
      marginRight: 0,
      display: "flex",
      alignItems: "center",

      ["& > div"]: {
        height: "100%",
        padding: ".25rem",
      },
    },
  },
});

export default withStyles(styles)(EntriesTable);

// TABLE ROWS
//------------------------------------------------------------------------------
const LinkRow = LinkRenderer("entryType", "url");
LinkRow.customSortFunc = textSearch("entryType");
LinkRow.columnWidth = 90;
LinkRow.flexGrow = 0;

const DebitRow = ({rowData: {type, debit}}) => {
  if (type !== "Debit") {
    return <div style={debitCellStyle} />;
  }

  return <div style={debitCellStyle}>{`${debit}`}</div>;
};

DebitRow.propTypes = {
  rowData: PropTypes.shape({
    type: PropTypes.string,
    debit: PropTypes.string,
  }),
};

DebitRow.disableSort = false;
DebitRow.column = "amount";
DebitRow.customSortFunc = amountSearch("amount");
DebitRow.columnWidth = 125;
DebitRow.flexGrow = 0;

const CreditRow = ({rowData: {type, credit}}) => {
  if (type !== "Credit") {
    return <div style={creditCellStyle} />;
  }

  return <div style={creditCellStyle}>{`${credit}`}</div>;
};

CreditRow.propTypes = {
  rowData: PropTypes.shape({
    type: PropTypes.string,
    credit: PropTypes.string,
  }),
};

CreditRow.disableSort = false;
CreditRow.column = "amount";
CreditRow.customSortFunc = amountSearch("amount");
CreditRow.columnWidth = 125;
CreditRow.flexGrow = 0;

// Entry Column
//------------------------------------------------------------------------------
const EntryColumn = ({rowData: {entryId = false}}) => {
  if (!entryId) {
    return null;
  }

  return <EntryModalBtn {...{entryId}} />;
};

EntryColumn.propTypes = {
  rowData: PropTypes.shape({
    entryId: PropTypes.number,
  }),
};

EntryColumn.disableSort = true;
EntryColumn.columnWidth = 75;
EntryColumn.flexGrow = 0;
