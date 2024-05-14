import {Fragment} from "react";
import PropTypes from "prop-types";
import Filter from "./purchase_order_filter";

// Components
import SearchableTable from "../../../searchable_table/searchable_table";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import DateRenderer from "../../../searchable_table/components/defaults/date_column";

const PurchaseOrdersTable = ({
  purchaseOrders = [],
  filter = {},
  showNumberFilter = true,
  showInvoiceNumberFilter = true,
  handleFilterNumberChange = function () {},
  handleFilterInvoiceNumberChange = function () {},
}) => {
  return (
    <Fragment>
      <Filter
        {...{
          ...filter,
          showNumberFilter,
          showInvoiceNumberFilter,
          handleFilterInvoiceNumberChange,
          handleFilterNumberChange,
        }}
      />
      <SearchableTable
        data={purchaseOrders}
        headers={["PO #", "Invoice #", "Date Needed", ""]}
        cells={[
          DefaultLinkRenderer("number", "path"),
          DefaultLinkRenderer("invoiceNumber", "invoicePath"),
          DateRenderer("dateNeeded", {columnWidth: 150}),
          DefaultViewLinkRenderer(),
        ]}
      />
    </Fragment>
  );
};

PurchaseOrdersTable.propTypes = {
  purchaseOrders: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  filter: PropTypes.object,
  showNumberFilter: PropTypes.bool,
  showInvoiceNumberFilter: PropTypes.bool,
  /* callbacks */
  handleFilterNumberChange: PropTypes.func.isRequired,
  handleFilterInvoiceNumberChange: PropTypes.func.isRequired,
};

export default PurchaseOrdersTable;
