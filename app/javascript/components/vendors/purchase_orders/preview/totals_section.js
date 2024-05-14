import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import {makeStyles} from "@material-ui/core/styles";
import {styles} from "../form";

import Grid from "@material-ui/core/Grid";
import TextField from "../form/styled_textfield";

const useStyles = makeStyles(styles);
export default function TotalsSection({
  purchaseOrder: {
    taxAmountInCents = 0,
    shippingAmountInCents = 0,
    subtotalInCents = 0,
    totalInCents = 0,
    paymentTerms = "",
  } = {},
}) {
  const classes = useStyles();
  const readOnly = true;
  const taxAmount = Number(taxAmountInCents / 100);
  const shippingAmount = Number(shippingAmountInCents / 100);
  const total = Number(totalInCents / 100);
  const subtotal = Number(subtotalInCents / 100);

  return (
    <Grid container spacing={2} className={classes.totalRow}>
      <Grid item xs>
        <Grid container spacing={2}>
          <Grid item xs className={classes.textControl}>
            <TextField
              fullWidth
              multiline
              id="paymentTerms"
              name="paymentTerms"
              label="Payment Terms"
              value={paymentTerms}
              InputProps={{readOnly}}
              className={classes.readOnly}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs /* Spacer */ />
        </Grid>
      </Grid>
      <Grid
        item
        xs={1}
        style={{flex: "none", maxWidth: "12px", width: "12px"}}
      />

      <Grid item xs sm={3} md={2} className={classes.formCell}>
        {/* Total Cells  */}
        <Grid container spacing={1}>
          <Grid item xs={12} className={classes.formCell}>
            <NumberFormat
              customInput={TextField}
              decimalScale={2}
              disabled
              fixedDecimalScale
              fullWidth
              InputProps={{readOnly: true}}
              label="Subtotal"
              prefix="$"
              readOnly
              thousandSeparator
              value={subtotal}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} className={classes.formCell}>
            <NumberFormat
              customInput={TextField}
              decimalScale={2}
              fixedDecimalScale
              fullWidth
              label="Tax Amount"
              name={"taxAmountInCents"}
              prefix="$"
              readOnly
              InputProps={{readOnly: true}}
              thousandSeparator
              value={taxAmount}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.formCell}>
            <NumberFormat
              customInput={TextField}
              decimalScale={2}
              fixedDecimalScale
              fullWidth
              label="Shipping Amount"
              name={"shippingAmountInCents"}
              prefix="$"
              readOnly
              InputProps={{readOnly: true}}
              thousandSeparator
              value={shippingAmount}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.formCell}>
            <NumberFormat
              className={classes.textInput}
              customInput={TextField}
              decimalScale={2}
              disabled
              fixedDecimalScale
              fullWidth
              InputProps={{readOnly: true}}
              label="Total"
              prefix="$"
              readOnly
              thousandSeparator
              value={total}
              variant="filled"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

TotalsSection.propTypes = {
  purchaseOrder: PropTypes.shape({
    buyer: PropTypes.string,
    requisitionNumber: PropTypes.string,
    referenceNumber: PropTypes.string,
    requestedBy: PropTypes.shape({fullName: PropTypes.string}),
    requestedFor: PropTypes.shape({fullName: PropTypes.string}),
  }),
};
