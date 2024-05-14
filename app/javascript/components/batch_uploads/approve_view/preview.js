import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import currency from "currency.js";

import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";

import PreviewVendorSection from "./preview_vendor_section";
import PreviewIframe from "./preview_iframe";

function Preview({
  file = {},
  handleChange,
  name,
  policy,
  signature,
  vendors = [],
  refetch = function () {},
}) {
  const classes = useStyles();
  const handleAmountChange =
    (name) =>
    ({floatValue}) => {
      handleChange({
        target: {
          name,
          value: floatValue,
        },
      });
    };

  const fileTotal = !file.accounts
    ? currency(0)
    : file.accounts.reduce((total, account) => {
        const {amount = 0} = account || {};
        return currency(total).add(amount);
      }, 0);

  return (
    <Box className={classes.root}>
      <PreviewIframe {...{policy, signature, file, refetch}} />
      <PreviewVendorSection
        {...{
          file,
          handleChange,
          name,
          vendors,
        }}
      />

      <Box className={classes.accounts}>
        {file.accounts &&
          file.accounts.map((account, i) => {
            return (
              <Box key={i} className={classes.accountRow}>
                <NumberFormat
                  allowNegative={false}
                  className={classes.accountRowAmount}
                  customInput={TextField}
                  decimalScale={2}
                  fixedDecimalScale
                  label="Amount"
                  margin="dense"
                  name={`${name}.amount`}
                  onValueChange={handleAmountChange(
                    `${name}.accounts[${i}].amount`
                  )}
                  prefix="$"
                  multiline
                  thousandSeparator
                  value={account.amount}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  readOnly
                  multiline
                  variant="outlined"
                  label="Account String"
                  margin="dense"
                  name="notes"
                  className={classes.accountRowAccountString}
                  value={account.accountNumber}
                  InputLabelProps={{shrink: true}}
                  inputProps={{
                    className: "browser-default",
                  }}
                />
              </Box>
            );
          })}
        <Box className={classes.totalRow}>
          <b>Total</b>
          {fileTotal && fileTotal.format()}
        </Box>
      </Box>
    </Box>
  );
}

Preview.propTypes = {
  file: PropTypes.object,
  name: PropTypes.string,
  policy: PropTypes.string,
  signature: PropTypes.string,
  vendors: PropTypes.array,

  handleChange: PropTypes.func,
  refetch: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  root: {},
  totalRow: {
    textAlign: "right",
    height: 52,
    fontSize: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    borderRadius: 4,
    padding: 8,
    background: "#f5f5f5",

    "& > b": {
      fontSize: "1.325em",
    },
  },
  accountRow: {
    display: "grid",
    gridTemplateColumns: "minmax(17.5rem, 2fr) minmax(8rem, 1fr)",
    gridColumnGap: 8,
  },

  accountRowAmount: {
    order: 1,
    "& textarea": {
      textAlign: "right",
    },
  },
  accountRowAccountString: {
    order: 0,
  },
}));

export default Preview;
