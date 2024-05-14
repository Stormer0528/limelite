import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import {useFormikContext} from "formik";
import NumberFormat from "react-number-format";

import Grid from "@material-ui/core/Grid";
import TextField from "./styled_textfield";

const TotalCells = ({
  handlePriceChange = function () {},
  disabled = false,
  readOnly = false,
  classes = {},
}) => {
  const {
    values: {
      purchaseOrderItems = [],
      taxAmountInCents = 0,
      shippingAmountInCents = 0,
    },
    handleBlur,
  } = useFormikContext();

  const taxAmount = Number(taxAmountInCents / 100);
  const shippingAmount = Number(shippingAmountInCents / 100);

  const subtotal = purchaseOrderItems.reduce(
    (total, {quantity = 0, priceInCents = 0}) => {
      return quantity * priceInCents + total;
    },
    0
  );

  const total = subtotal + taxAmountInCents + shippingAmountInCents;
  return (
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
            value={Number(subtotal / 100)}
            variant="filled"
          />
        </Grid>
        <Grid item xs={12} className={classes.formCell}>
          <NumberFormat
            customInput={TextField}
            decimalScale={2}
            disabled={disabled}
            fixedDecimalScale
            fullWidth
            label="Tax Amount"
            name={"taxAmountInCents"}
            onBlur={handleBlur}
            onValueChange={handlePriceChange("taxAmountInCents")}
            prefix="$"
            readOnly={readOnly}
            thousandSeparator
            value={taxAmount}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} className={classes.formCell}>
          <NumberFormat
            customInput={TextField}
            decimalScale={2}
            disabled={disabled}
            fixedDecimalScale
            fullWidth
            label="Shipping Amount"
            name={"shippingAmountInCents"}
            onBlur={handleBlur}
            onValueChange={handlePriceChange("shippingAmountInCents")}
            prefix="$"
            readOnly={readOnly}
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
            value={Number(total / 100)}
            variant="filled"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

TotalCells.propTypes = {
  handlePriceChange: PropTypes.any,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  formCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",

    "&.disabled.readOnly input": {
      color: "#333",
    },
  },
});

export default withStyles(styles)(TotalCells);
