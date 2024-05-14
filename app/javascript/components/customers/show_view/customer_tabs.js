import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";

import EntriesTable from "./entries_table";
import InvoicesTable from "./invoices_table";
// import PurchaseOrdersTable from "./purchase_orders_table";
import TableHeader from "./table_header";

import {withStyles} from "@material-ui/core/styles";

const EntriesInfo = ({customer_id, classes = {}}) => {
  return (
    <Paper className={classes.root}>
      <TableHeader>
        {({currentTab}) => {
          return (
            <div>
              {currentTab === 0 && (
                <Fade in>
                  <EntriesTable {...{customer_id}} />
                </Fade>
              )}
              {currentTab === 1 && (
                <Fade in>
                  <InvoicesTable
                    {...{customer_id, showCustomerFilter: false}}
                  />
                </Fade>
              )}
            </div>
          );
        }}
      </TableHeader>
    </Paper>
  );
};

EntriesInfo.propTypes = {
  customer_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entries: PropTypes.array,
  classes: PropTypes.object,
};

const styles = theme => ({
  root: {
    boxShadow: "none",
  },
});

export default withStyles(styles)(EntriesInfo);
