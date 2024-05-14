import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";

import {formatNumber} from "humanize-plus";
import {withStyles} from "@material-ui/core/styles";

const TotalRow = ({
  // classes = {},
  parent_class,
  total = 0,
  invoiceRemaining = 0,
  finalPayment = true,
  handleFinalPaymentClick = function() {},
}) => {
  if (parent_class === "vendor_payment") {
    return (
      <Grid container alignItems="center">
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={finalPayment}
                  onChange={handleFinalPaymentClick}
                />
              }
              label="Final Payment"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={8} className="right-align">
          <Grid container alignItems="center">
            <Grid item sm={4}>
              <b>Invoice Amount:</b>
              <br />${formatNumber(invoiceRemaining, 2)}
            </Grid>
            <Grid item sm={4}>
              <b>Payment Amount:</b>
              <br />${formatNumber(total, 2)}
              <div className="hidden HiddenInputs">
                <input
                  name={`${parent_class}[amount]`}
                  type="hidden"
                  value={`${total}`}
                />
              </div>
            </Grid>
            <Grid item sm={4}>
              <b>Invoice Remaining:</b>
              <br />${formatNumber(invoiceRemaining - total, 2)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container alignItems="center">
      <Grid item xs={12} className="right-align">
        <Grid container alignItems="flex-end">
          <Grid item sm={12}>
            <b>Amount:</b>
            <br />${formatNumber(total, 2)}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

TotalRow.propTypes = {
  parent_class: PropTypes.string,
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  invoiceRemaining: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object,
  finalPayment: PropTypes.bool,
  handleFinalPaymentClick: PropTypes.func,
};

const styles = theme => ({});

export default withStyles(styles)(TotalRow);
