import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

// Components
import SearchableTable from "../../../searchable_table/searchable_table";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import DateRenderer from "../../../searchable_table/components/defaults/date_column";

const PurchaseOrdersTable = ({purchaseOrders = [], classes = {}}) => {
  return (
    <section className={classes.root}>
      <SearchableTable
        data={purchaseOrders}
        headers={["PO #", "Invoice #", "Vendor", "Date Needed", "Status", ""]}
        cells={[
          DefaultLinkRenderer("number", "path"),
          "invoice_number",
          DefaultLinkRenderer("vendor_name", "vendor_path"),
          DateRenderer("date_needed"),
          "status",
          DefaultViewLinkRenderer(),
        ]}
      />
    </section>
  );
};

PurchaseOrdersTable.propTypes = {
  purchaseOrders: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object,
};

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
});

export default withStyles(styles)(PurchaseOrdersTable);
