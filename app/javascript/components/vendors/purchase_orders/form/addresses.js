import {useCallback, useState, Fragment} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import AddressSelector from "../../../shared/address_selector";
import Address from "../../../shared/address";
import InvoiceDropdown from "../invoice_dropdown";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

import AddIcon from "@material-ui/icons/NoteAdd";

const Addresses = ({
  address = {},
  disabled,
  handleChange,
  invoiceId,
  invoicePath,
  organizationId,
  purchaseOrderId,
  readOnly,
  hideInvoiceBtn = false,
  values,
  vendorAddress = {},
  vendorId,
  vendorSlug,
  classes = {},
}) => {
  const [shouldRefreshInvoices, setAddInvoiceClicked] = useState(false);
  const handleLinkClick = useCallback(() => {
    setAddInvoiceClicked(true);
  }, []);
  return (
    <Grid
      container
      spacing={2}
      style={{
        marginTop: "1.5rem",
        borderTop: "1px solid #e0e0e0",
        paddingTop: ".5rem",
      }}
      className={classes.root}
    >
      <Grid
        item
        sm={4}
        style={{
          display: `${readOnly ? "block" : "flex"}`,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
        className={classes.addressSection}
      >
        {!readOnly && (
          <AddressSelector
            name="addressId"
            value={values.addressId}
            addressableType="Organization"
            addressableIds={[organizationId]}
            readOnly={readOnly}
            disabled={disabled}
            onChange={handleChange}
          />
        )}
        {readOnly && (
          <Fragment>
            <b>Address</b>
            <Address {...address} />
          </Fragment>
        )}
      </Grid>
      <Grid
        item
        sm={4}
        style={{
          display: `${readOnly ? "block" : "flex"}`,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
        className={classes.addressSection}
      >
        {!readOnly && (
          <AddressSelector
            label="Vendor Address"
            name="vendorAddressId"
            value={values.vendorAddressId}
            addressableType="Vendor"
            addressableIds={[vendorId]}
            readOnly={readOnly}
            disabled={disabled}
            onChange={handleChange}
          />
        )}
        {readOnly && (
          <Fragment>
            <b>Vendor Address</b>
            <Address {...vendorAddress} />
          </Fragment>
        )}
      </Grid>
      <Grid
        item
        sm={4}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(min-content, 1fr) 64px",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        <InvoiceDropdown
          {...{
            pollInterval:
              /* Tell query to update if we are creating an invoice  */
              shouldRefreshInvoices && document.hasFocus() ? 2500 : 0,
            vendorId,
            invoiceId,
            invoicePath,
            onChange: handleChange,
            readOnly,
            disabled,
          }}
        />
        {!readOnly && (
          <Tooltip title="Add Invoice">
            <IconButton
              href={`/vendors/${vendorSlug}/invoices/new${
                purchaseOrderId ? "/" + purchaseOrderId : ""
              }`}
              target="_blank"
              placement="top"
              onClick={handleLinkClick}
              style={{marginLeft: "1rem"}}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
        {!hideInvoiceBtn && readOnly && !invoiceId && (
          <Button
            href={`/vendors/${vendorSlug}/invoices/new${
              purchaseOrderId ? "/" + purchaseOrderId : ""
            }`}
            target="_blank"
            placement="top"
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
          >
            Create Invoice
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

Addresses.propTypes = {
  address: PropTypes.object,
  addressId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  addressfield: PropTypes.string,
  classes: PropTypes.object,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  hideInvoiceBtn: PropTypes.bool,
  invoiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invoicePath: PropTypes.string,
  organizationId: PropTypes.string,
  purchaseOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  values: PropTypes.object,
  vendorAddress: PropTypes.object,
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vendorSlug: PropTypes.string,
};

export default withStyles({
  addressSection: {
    root: {},
    "& b": {
      color: "#546E7A",
    },
  },
})(Addresses);
