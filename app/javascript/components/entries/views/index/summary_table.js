import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import SearchableTable from "../../../searchable_table/searchable_table";
import ViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import LinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import DateRenderer from "../../../searchable_table/components/defaults/date_column";
import TextColumn from "../../../searchable_table/components/defaults/text_column";
import {textSearch} from "../../../searchable_table/utils/search_functions";
import {creditCell, debitCell} from "../../../new_entry_btn/entry_item";
import EntryModalBtn from "../../../shared/entry_modal/entry_modal_btn";

const EntriesTable = ({items = [], classes = {}}) => {
  return (
    <div className={classes.root}>
      <SearchableTable
        data={items}
        headers={[
          "Type",
          "Date",
          "State",
          "Account",
          "Memo",
          "Entry",
          "Debit",
          "Credit",
          "",
        ]}
        cells={[
          TextColumn("entryType", {columnWidth: 85, flexGrow: 0}),
          DateRenderer("date"),
          StateCellRenderer("aasmState", {columnWidth: 115}),
          LinkRenderer("accountNumber", "url", {columnWidth: 135, flexGrow: 2}),
          "memo",
          EntryColumn,
          DebitRow,
          CreditRow,
          ViewLinkRenderer({
            pathProperty: "entryPath",
            showEdit: false,
            showDelete: false,
            columnWidth: 50,
          }),
        ]}
      />
    </div>
  );
};

EntriesTable.propTypes = {
  items: PropTypes.array,
  classes: PropTypes.object,
};

// Styles
//------------------------------------------------------------------------------
const baseAmount = {
  flex: "1 0 100%",
  display: "inline-flex",
  justifyContent: "flex-end",
  alignContent: "center",
  alignItems: "flex-end",
  padding: ".5em .125em",
  width: "100%",
};

const creditCellStyle = Object.assign({}, baseAmount, creditCell);
const debitCellStyle = Object.assign({}, baseAmount, debitCell);

const styles = (theme) => ({
  root: {
    flex: "auto",
    height: "100%",
    width: "100%",
    display: "flex",
    flexBasis: "500px",
    minHeight: "250px",
    flexDirection: "column",

    ["& .SearchableTable .ReactVirtualized__Table__headerRow .ReactVirtualized__Table__headerColumn"]: {
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
        padding: ".5rem",
      },
    },
  },
});

export default withStyles(styles)(EntriesTable);

// TABLE ROWS
//------------------------------------------------------------------------------
const LinkRow = LinkRenderer("entryType", "entry_path");
LinkRow.customSortFunc = textSearch("entryType");
LinkRow.columnWidth = 85;
LinkRow.flexGrow = 0;

const DebitRow = ({rowData: {type, debit}}) => {
  if (type !== "Debit") {
    return <div style={debitCellStyle} />;
  }

  return <div style={debitCellStyle}>{debit}</div>;
};

DebitRow.propTypes = {
  rowData: PropTypes.shape({
    credit: PropTypes.string,
  }),
};

DebitRow.disableSort = false;
DebitRow.column = "amount";
DebitRow.customSortFunc = textSearch("amount");
DebitRow.columnWidth = 125;
DebitRow.flexGrow = 0;

const CreditRow = ({rowData: {type, credit}}) => {
  if (type !== "Credit") {
    return <div style={creditCellStyle} />;
  }

  return <div style={creditCellStyle}>{credit}</div>;
};

CreditRow.propTypes = {
  rowData: PropTypes.shape({
    credit: PropTypes.string,
  }),
};

CreditRow.disableSort = false;
CreditRow.column = "amount";
CreditRow.customSortFunc = textSearch("amount");
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
