import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";
import uniqBy from "lodash/uniqBy";

import Dropdown from "./dropdown";
import INVOICE_QUERY from "../../../../graphql/queries/vendor_invoices.gql";

const InvoiceDropdownContainer = ({
  pollInterval = 0,
  invoiceId,
  vendorId,
  ...rest
}) => {
  const {
    data: {current, invoices: initial = []} = {},
    loading = false,
  } = useQuery(INVOICE_QUERY, {
    variables: {vendorId, currentId: invoiceId},
    skip: !vendorId,
    pollInterval,
  });
  const invoices = uniqBy([...initial, current].filter(Boolean), "id");
  return <Dropdown {...{loading, invoices, invoiceId, vendorId, ...rest}} />;
};

InvoiceDropdownContainer.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pollInterval: PropTypes.number,
};

export default InvoiceDropdownContainer;
