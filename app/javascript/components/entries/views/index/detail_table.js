import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
import SearchableTable from "../../../searchable_table/searchable_table";
import ViewLinksColumn from "../../../searchable_table/components/defaults/view_links_renderer";
import StateColumn from "../../../searchable_table/components/defaults/state_cell_renderer";
import LinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import DateColumn from "../../../searchable_table/components/defaults/date_column";
import AmountColumn from "../../../searchable_table/components/defaults/currency_column";

import {textSearch} from "../../../searchable_table/utils/search_functions";
import PopupBtn from "../../../shared/popup_btn";
import Entry from "./entry";

const EntriesTable = ({entries = [], classes = {}}) => {
  return (
    <SearchableTable
      className={`${classes.root}`}
      data={entries}
      headers={["Type", "Date", "Journalable", "State", "", "Amount", ""]}
      cells={[
        LinkRow,
        DateColumn("date"),
        LinkRenderer("journalableType", "journalablePath"),
        StateColumn("aasmState", {flexGrow: 1}),
        EntryColumn,
        AmountColumn("amount"),
        ViewLinksColumn({
          pathProperty: "url",
          showEdit: false,
          showDelete: false,
          columnWidth: 50,
        }),
      ]}
    />
  );
};

EntriesTable.propTypes = {
  entries: PropTypes.array,
  classes: PropTypes.object,
};

// Styles
//------------------------------------------------------------------------------
const styles = (theme) => ({
  root: {
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
const LinkRow = LinkRenderer("entryType", "url");
LinkRow.customSortFunc = textSearch("type");
LinkRow.columnWidth = 135;
LinkRow.flexGrow = 0;

// Entry Column
//------------------------------------------------------------------------------
const EntryColumn = ({rowData}) => {
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
      <Entry entry={rowData} />
    </PopupBtn>
  );
};

EntryColumn.propTypes = {
  rowData: PropTypes.shape({
    entry: PropTypes.object,
  }),
};

EntryColumn.disableSort = true;
EntryColumn.columnWidth = 75;
EntryColumn.flexGrow = 1;
