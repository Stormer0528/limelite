import PropTypes from "prop-types";

// components
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

// Default Cells
import LinkRenderer from "../searchable_table/components/defaults/link_renderer";
import DefaultViewLinkRenderer from "../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../searchable_table/searchable_table";

const AccountsViewTable = ({accounts = [], classes = {}}) => {
  return (
    <Paper id="AccountsTable" className={`${classes.root}`}>
      <SearchableTable
        data={accounts}
        listLength={accounts.length}
        location={location}
        storeKey="AccountsTable"
        headers={["Number", "Name", "Budget", ""]}
        cells={[
          LinkRenderer("number", "path"),
          "name",
          BudgetCell,
          DefaultViewLinkRenderer({
            editPathProperty: "editPath",
            defaultEdit: false,
            showDelete: false,
            columnWidth: 65,
            flexGrow: 0,
          }),
        ]}
      />
    </Paper>
  );
};

AccountsViewTable.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      fundCode: PropTypes.string,
      fuctionCode: PropTypes.string,
      objectCode: PropTypes.string,
      locationCode: PropTypes.string,
      yearCode: PropTypes.string,
      path: PropTypes.string,
      edit_path: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  editButton: {
    color: "#4CAF50",
    margin: theme.spacing(1),
  },
  showButton: {
    color: "#4DD0E1",
    margin: theme.spacing(1),
  },
  textCell: {
    padding: ".25em .75rem",
  },
  numberCell: {
    padding: ".25em .75rem",
    width: "20em",
  },
});

export default withStyles(styles)(AccountsViewTable);

// CELLS
//----------------------------------------------------------------------------------------

const BudgetCell = ({rowData: {currentBudgetAmount: budget} = {}}) => {
  if (!budget || budget === 0) {
    return (
      <div className="grey-text" style={{textAlign: "right"}}>
        &mdash;
      </div>
    );
  }
  return <div style={{textAlign: "right"}}>{budget}</div>;
};

BudgetCell.propTypes = {
  rowData: PropTypes.shape({
    currentBudgetAmount: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
};

BudgetCell.flexGrow = 0;
BudgetCell.columnWidth = 95;
