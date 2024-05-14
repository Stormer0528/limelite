import DateRenderer from "../../../searchable_table/components/defaults/date_column";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import StateBtnColumn from "../../../searchable_table/components/defaults/state_btn_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../../searchable_table/searchable_table";
// Components
import InvoiceFilter from "./invoice_filter";
import {withStyles} from "@material-ui/core/styles";
// Icons
import CheckIcon from "@material-ui/icons/CheckCircle";
import PropTypes from "prop-types";

const InvoicesTable = ({
  loading = false,
  showCustomerFilter = false,
  invoices = [],
  filter = {},
  createStateBtnHandler = function () {},
  handleInvoiceFilterStateChange = function () {},
  handleInvoiceFilterNumberChange = function () {},
  handleFilterCustomerIdChange = function () {},
  handleInvoiceFilterPaidChange = function () {},
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <InvoiceFilter
        {...filter}
        {...{
          loading,
          showCustomerFilter,
          handleFilterStateChange: handleInvoiceFilterStateChange,
          handleFilterNumberChange: handleInvoiceFilterNumberChange,
          handleFilterCustomerIdChange,
          handleFilterPaidChange: handleInvoiceFilterPaidChange,
        }}
      />
      <SearchableTable
        data={invoices}
        headers={[
          "Paid",
          "Invoice #",
          "Date",
          "State",
          "Customer",
          "Due on",
          "Amount Due",
          "",
          "",
        ]}
        cells={[
          PaidColumn,
          InvoiceRow,
          DateRenderer("date"),
          StateCellRenderer("aasmState", {columnWidth: 135}),
          CustomerRow,
          DateRenderer("dueDate"),
          AmountDueColumn,
          StateBtnColumn({
            stateProperty: "aasmState",
            columnWidth: 150,
            flexGrow: 0,
            clickHandler: createStateBtnHandler("invoice"),
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
            showDelete: false,
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
  showCustomerFilter: PropTypes.bool,
  filter: PropTypes.object,
  classes: PropTypes.object.isRequired,
  createStateBtnHandler: PropTypes.func.isRequired,
  handleInvoiceFilterStateChange: PropTypes.func.isRequired,
  handleInvoiceFilterNumberChange: PropTypes.func.isRequired,
  handleFilterCustomerIdChange: PropTypes.func.isRequired,
  handleInvoiceFilterPaidChange: PropTypes.func.isRequired,
};
const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
  },
});

export default withStyles(styles)(InvoicesTable);

// TABLE COLUMNS
//------------------------------------------------------------------------------
const InvoiceRow = DefaultLinkRenderer("number", "path", {
  columnWidth: 125,
  flexGrow: 2,
  flexShrink: 1,
});
InvoiceRow.columnWidth = 125;
InvoiceRow.flexGrow = 1;
InvoiceRow.flexShrink = 1;

const CustomerRow = ({rowData: {invoiceable: {name, path} = {}}}) => (
  <a href={path}>{name}</a>
);
CustomerRow.columnWidth = 150;
CustomerRow.flexGrow = 1;
CustomerRow.propTypes = {
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
const AmountDueColumn = ({rowData: {amountRemaining}}) => (
  <div className="right-align">{amountRemaining}</div>
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
