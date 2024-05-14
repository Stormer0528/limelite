import DateRenderer from "../../../searchable_table/components/defaults/date_column";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import StateBtnColumn from "../../../searchable_table/components/defaults/state_btn_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../../searchable_table/searchable_table";
// Components
import InvoiceFilter from "./invoice_filter";
import LinearProgress from "@material-ui/core/LinearProgress";
import {withStyles} from "@material-ui/core/styles";
// Icons
import CheckIcon from "@material-ui/icons/CheckCircle";
import PropTypes from "prop-types";

const InvoicesTable = ({
  loading = false,
  invoices = [],
  filter = {},
  showVendorFilter = true,
  showStateFilter = true,
  showNumberFilter = true,
  showPaidFilter = true,
  showVoidFilter = true,
  createStateBtnHandler = function () {},
  handleInvoiceFilterStateChange = function () {},
  handleInvoiceFilterNumberChange = function () {},
  handleInvoiceFilterPaidChange = function () {},
  handleInvoiceVoidChange = function () {},
  handleFilterVendorIdChange = function () {},
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <InvoiceFilter
        {...filter}
        {...{
          loading,
          handleFilterVendorIdChange,
          showVendorFilter,
          showStateFilter,
          showNumberFilter,
          showPaidFilter,
          showVoidFilter,
          handleFilterStateChange: handleInvoiceFilterStateChange,
          handleFilterNumberChange: handleInvoiceFilterNumberChange,
          handleFilterPaidChange: handleInvoiceFilterPaidChange,
          handleFilterVoidChange: handleInvoiceVoidChange,
        }}
      />
      {loading && (
        <LinearProgress
          classes={{root: classes.progress, bar: classes.progressBar}}
        />
      )}
      <SearchableTable
        data={invoices}
        headers={[
          "Paid",
          "Invoice #",
          "Date",
          "State",
          "Vendor",
          "Due on",
          "Amount Due",
          "",
          "",
        ]}
        cells={[
          PaidColumn,
          InvoiceRow,
          "date",
          StateCellRenderer("aasmState", {columnWidth: 135}),
          VendorRow,
          DateRenderer("dueDate"),
          AmountDueColumn,
          StateBtnColumn({
            stateProperty: "aasmState",
            clickHandler: createStateBtnHandler("invoice"),
            columnWidth: 150,
            flexGrow: 0,
            states: {
              draft: ["send_for_approval"],
              needs_revision: ["send_for_approval"],
              needs_approval: ["approve", "deny"],
              ready_to_pay: ["reverse_approval"],
              approved: ["reverse_approval"],
            },
          }),
          DefaultViewLinkRenderer({
            editPathProperty: "editPath",
            showDelete: true,
            columnWidth: 65,
            flexGrow: 0,
          }),
        ]}
      />
    </section>
  );
};

InvoicesTable.propTypes = {
  invoices: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  filter: PropTypes.object,
  classes: PropTypes.object,
  showVendorFilter: PropTypes.bool,
  showStateFilter: PropTypes.bool,
  showNumberFilter: PropTypes.bool,
  showPaidFilter: PropTypes.bool,
  /* callbacks */
  createStateBtnHandler: PropTypes.func.isRequired,
  handleInvoiceFilterStateChange: PropTypes.func.isRequired,
  handleInvoiceFilterPaidChange: PropTypes.func.isRequired,
  handleInvoiceVoidChange: PropTypes.func.isRequired,
  handleFilterVendorIdChange: PropTypes.func.isRequired,
  handleInvoiceFilterNumberChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
  progress: {
    height: 2,
    backgroundColor: "#009688",
  },
  progressBar: {
    backgroundColor: "#74ab4b",
  },
});

export default withStyles(styles)(InvoicesTable);

// TABLE COLUMNS
//------------------------------------------------------------------------------
const InvoiceRow = DefaultLinkRenderer("number", "path");
InvoiceRow.columnWidth = 125;
InvoiceRow.flexGrow = 2;
InvoiceRow.flexShrink = 1;

const VendorRow = ({rowData: {invoiceable: {name, path} = {}}}) => (
  <a href={path}>{name}</a>
);
VendorRow.columnWidth = 150;
VendorRow.flexGrow = 1;
VendorRow.propTypes = {
  rowData: PropTypes.shape({
    invoiceable: PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string,
    }),
  }),
};

// CHECK COLUMN
const PaidColumn = ({rowData: {paid}}) => (
  <div
    className="check-column green-text text-lighten-1"
    style={{display: "flex", placeContent: "center"}}
  >
    {paid && <CheckIcon />}
  </div>
);
PaidColumn.propTypes = {
  rowData: PropTypes.shape({
    paid: PropTypes.bool,
  }),
};
PaidColumn.columnWidth = 55;
PaidColumn.flexGrow = 0;
PaidColumn.flexShrink = 0;

// AMOUNT REMAINING
const AmountDueColumn = ({rowData: {amount}}) => (
  <div className="right-align">{amount}</div>
);
AmountDueColumn.propTypes = {
  rowData: PropTypes.shape({
    amount_remaining: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  }),
};
AmountDueColumn.columnWidth = 110;
AmountDueColumn.maxWidth = 115;
AmountDueColumn.flexGrow = 0;
AmountDueColumn.flexShrink = 0;
