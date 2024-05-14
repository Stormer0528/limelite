// Account Finder -->  AccountsTable
import PropTypes from "prop-types";
import SearchableTable from "../searchable_table_infinite/components/table.js";

// components
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/core/styles";

// Default Cells
import LinkRenderer from "../searchable_table/components/defaults/link_renderer";
import DefaultViewLinkRenderer from "../searchable_table/components/defaults/view_links_renderer";

const AccountsViewTable = ({
  accounts = [],
  fetchMore = function () {},
  classes = {},
}) => {
  return (
    <Paper id="AccountsTable" className={`${classes.root}`}>
      <SearchableTable
        data={accounts.filter((i) => i)}
        fetchMore={fetchMore}
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
  fetchMore: PropTypes.func.isRequired,
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

const styles = (theme) => ({
  root: {
    marginTop: "1em",
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
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
