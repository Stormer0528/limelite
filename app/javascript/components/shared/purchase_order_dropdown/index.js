import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";
import uniqBy from "lodash/uniqBy";

import Dropdown from "./dropdown";
import PO_QUERY from "../../../graphql/queries/vendor_purchase_orders.gql";

const InvoiceDropdownContainer = ({
  pollInterval = 0,
  purchaseOrderId,
  vendorId,
  value,
  ...rest
}) => {
  const {
    data: {current, purchaseOrders: initial = []} = {},
    loading = false,
  } = useQuery(PO_QUERY, {
    variables: {vendorId, currentId: value || ""},
    skip: !vendorId,
    pollInterval,
  });

  const purchaseOrders = uniqBy([...initial, current].filter(Boolean), "id");
  return (
    <Dropdown
      {...{
        loading,
        purchaseOrders,
        purchaseOrderId,
        vendorId,
        value,
        ...rest,
      }}
    />
  );
};

InvoiceDropdownContainer.propTypes = {
  purchaseOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pollInterval: PropTypes.number,
};

export default InvoiceDropdownContainer;
