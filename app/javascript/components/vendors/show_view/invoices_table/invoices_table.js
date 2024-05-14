import DateRenderer from "../../../searchable_table/components/defaults/date_column";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import StateBtnColumn from "../../../searchable_table/components/defaults/state_btn_renderer";
import StateCellRenderer from "../../../searchable_table/components/defaults/state_cell_renderer";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../../searchable_table/searchable_table";
// Components
import InvoiceFilter from "../../index/index_view/invoice_filter";
import InvoiceModalBtn from "./invoice_modal_btn";
import PaymentForm from "./pay_invoices_form";
import Checkbox from "@material-ui/core/Checkbox";
import {withStyles} from "@material-ui/core/styles";
// Icons
import CheckIcon from "@material-ui/icons/CheckCircle";
import {format} from "date-fns/esm";
import PropTypes from "prop-types";

const InvoicesTable = ({
  loading = false,
  invoices = [],
  filter = {},
  vendor_id,
  showVendorFilter = true,
  showStateFilter = true,
  showNumberFilter = true,
  showPaidFilter = true,
  createStateBtnHandler = function () {},
  handleInvoiceFilterStateChange = function () {},
  handleInvoiceFilterNumberChange = function () {},
  handleInvoiceFilterPaidChange = function () {},
  handleFilterVendorIdChange = function () {},
  selectedInvoices = new Set(),
  setSelectedInvoices = function () {},
  classes = {},
}) => {
  const handleInvoiceSelected = (id) => () => {
    if (!selectedInvoices.has(id)) {
      selectedInvoices.add(id);
    } else {
      selectedInvoices.delete(id);
    }
    setSelectedInvoices(selectedInvoices);
  };

  const headers = [
    // "",
    "Paid",
    "Invoice #",
    "View",
    "Date",
    "State",
    "Due On",
    "Amount",
    "Check #",
    "Check Date",
    "",
    "",
  ];

  const cells = [
    PaidColumn({
      handleCellClick: handleInvoiceSelected,
      selectedCells: selectedInvoices,
    }),
    // PaidColumn,
    InvoiceRow,
    ViewInvoiceColumn,
    DateRenderer("date", {inputDateFormat: "MM/dd/yyyy"}),
    StateCellRenderer("aasmState", {columnWidth: 135}),
    DateRenderer("dueDate"),
    "amount",
    CheckNumberColumn,
    CheckDateColumn,
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
  ];

  return (
    <section className={classes.root}>
      {selectedInvoices.size > 0 && (
        <PaymentForm {...{invoiceIds: selectedInvoices, vendorId: vendor_id}} />
      )}

      <InvoiceFilter
        {...filter}
        {...{
          loading,
          handleFilterVendorIdChange,
          showVendorFilter,
          showStateFilter,
          showNumberFilter,
          showPaidFilter,
          handleFilterStateChange: handleInvoiceFilterStateChange,
          handleFilterNumberChange: handleInvoiceFilterNumberChange,
          handleFilterPaidChange: handleInvoiceFilterPaidChange,
        }}
      />
      <SearchableTable
        data={invoices}
        headers={headers}
        selected={selectedInvoices}
        handleItemSelect={handleInvoiceSelected}
        cells={cells}
      />
    </section>
  );
};

InvoicesTable.propTypes = {
  vendor_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invoices: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  filter: PropTypes.object,
  classes: PropTypes.object,
  showVendorFilter: PropTypes.bool,
  showStateFilter: PropTypes.bool,
  showNumberFilter: PropTypes.bool,
  showPaidFilter: PropTypes.bool,
  selectedInvoices: PropTypes.instanceOf(Set),
  /* callbacks */
  createStateBtnHandler: PropTypes.func.isRequired,
  handleInvoiceFilterStateChange: PropTypes.func.isRequired,
  handleInvoiceFilterVendorNameChange: PropTypes.func,
  handleInvoiceFilterPaidChange: PropTypes.func.isRequired,
  handleFilterVendorIdChange: PropTypes.func.isRequired,
  handleInvoiceFilterNumberChange: PropTypes.func.isRequired,
  setSelectedInvoices: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: "1",
    position: "relative",
  },
});

export default withStyles(styles)(InvoicesTable);

// TABLE COLUMNS
//------------------------------------------------------------------------------
const InvoiceRow = DefaultLinkRenderer("number", "path");
InvoiceRow.columnWidth = 125;
InvoiceRow.flexGrow = 2;
InvoiceRow.flexShrink = 1;

// CHECK NUMBER COLUMN
const CheckNumberColumn = ({rowData: {checks = []}}) => {
  return (
    <div
      style={{display: "flex", placeContent: "flex-start", paddingLeft: "8px"}}
    >
      {checks.map(({number, path}) => (
        <a key={number} href={path} target="_blank" rel="noopener noreferrer">
          {number}
        </a>
      ))}
    </div>
  );
};

CheckNumberColumn.propTypes = {
  rowData: PropTypes.shape({
    checks: PropTypes.arrayOf(PropTypes.shape({number: PropTypes.string})),
  }),
};

// View Invoice Column
const ViewInvoiceColumn = ({rowData}) => {
  return <InvoiceModalBtn id={rowData.id} path={rowData.path} />;
};

ViewInvoiceColumn.propTypes = {
  rowData: PropTypes.shape({
    entryId: PropTypes.number,
  }),
};

ViewInvoiceColumn.disableSort = true;
ViewInvoiceColumn.columnWidth = 75;
ViewInvoiceColumn.flexGrow = 0;

// CHECK DATE COLUMN
const CheckDateColumn = ({rowData: {checks = []}}) => {
  return (
    <div
      style={{display: "flex", placeContent: "flex-start", paddingLeft: "8px"}}
    >
      {checks.map(({date}) => format(date, "MM/dd/yyyy")).join(", ")}
    </div>
  );
};

CheckDateColumn.propTypes = {
  rowData: PropTypes.shape({
    checks: PropTypes.arrayOf(PropTypes.shape({number: PropTypes.string})),
  }),
};
InvoiceRow.columnWidth = 125;

// PAID COLUMN
const PaidColumn =
  ({handleCellClick = () => {}, selectedCells = new Set()}) =>
  ({rowData: {id, paid}}) => {
    const selected = selectedCells.has(id);
    return (
      <div
        className="check-column green-text text-lighten-1"
        style={{display: "flex", placeContent: "center", marginLeft: "-12px"}}
      >
        {paid && <CheckIcon />}
        {!paid && (
          <Checkbox
            checked={selected}
            name={id}
            id={id}
            onClick={handleCellClick(id)}
          />
        )}
      </div>
    );
  };

PaidColumn.propTypes = {
  rowData: PropTypes.shape({
    id: PropTypes.string,
    paid: PropTypes.bool,
  }),
};

PaidColumn.columnWidth = 55;
PaidColumn.flexGrow = 0;
PaidColumn.flexShrink = 0;
