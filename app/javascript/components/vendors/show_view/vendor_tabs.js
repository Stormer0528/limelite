import {Fragment} from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";

import EntriesTable from "./entries_table";
import InvoicesTable from "./invoices_table";
import PurchaseOrdersTable from "./purchase_orders_table";
import FileUploadsTable from "./file_uploads_table";
import TableHeader from "./table_header";

import {withStyles} from "@material-ui/core/styles";

const VendorTabs = ({vendor_id, classes = {}}) => {
  return (
    <Paper className={classes.root}>
      <TableHeader>
        {({currentTab}) => {
          return (
            <Fragment>
              {currentTab === 0 && (
                <Fade in>
                  <EntriesTable {...{vendor_id}} />
                </Fade>
              )}
              {currentTab === 1 && (
                <Fade in>
                  <PurchaseOrdersTable {...{vendor_id}} />
                </Fade>
              )}
              {currentTab === 2 && (
                <Fade in>
                  <InvoicesTable {...{vendor_id, showVendorFilter: false}} />
                </Fade>
              )}
              {currentTab === 3 && (
                <Fade in>
                  <FileUploadsTable {...{vendor_id}} />
                </Fade>
              )}
            </Fragment>
          );
        }}
      </TableHeader>
    </Paper>
  );
};

VendorTabs.propTypes = {
  vendor_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entries: PropTypes.array,
  classes: PropTypes.object,
};

const styles = () => ({
  root: {
    boxShadow: "none",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
});

export default withStyles(styles)(VendorTabs);
