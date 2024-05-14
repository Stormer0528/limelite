import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

// Components
import SearchableTable from "../../../searchable_table/searchable_table";
import DefaultViewLinkRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import DefaultLinkRenderer from "../../../searchable_table/components/defaults/link_renderer";
import DateRenderer from "../../../searchable_table/components/defaults/date_column";

import PO_QUERY from "../../../../graphql/queries/purchase_orders_connection.gql";

const PurchaseOrdersTable = ({classes = {}}) => {
  const response = useQuery(PO_QUERY, {
    // vendor_id,
    // number,
    // invoice_number,
    // first: 50,
  });

  const {data, data: {purchaseOrders: {edges = []} = {}} = {}} = response;

  const purchaseOrders = edges.map(edge => edge.node);

  return (
    <SearchableTable
      data={purchaseOrders}
      headers={["PO #", "Invoice #", "Vendor", "Date Needed", "Status", ""]}
      cells={[
        DefaultLinkRenderer("number", "path"),
        DefaultLinkRenderer("invoiceNumber", "invoicePath"),
        DefaultLinkRenderer("vendorName", "vendorPath"),
        DateRenderer("dateNeeded"),
        "aasmState",
        DefaultViewLinkRenderer({
          pathProperty: "path",
          editPathProperty: "editPath",
          showDelete: false,
          columnWidth: 80,
          flexGrow: 0,
          target: "_blank",
        }),
      ]}
    />
  );
};

PurchaseOrdersTable.propTypes = {
  classes: PropTypes.object,
};

export default PurchaseOrdersTable;
