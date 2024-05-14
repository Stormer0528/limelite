/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {memo, useCallback} from "react";
import NumberFormat from "react-number-format";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {useDebounceFn} from "@umijs/hooks";

export const creditCell = {
  background: " #E8F5E9",
  color: " #388e3c",
  border: " 2px solid #388e3c",
  borderWidth: " 0 2px 0 1px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",

  "& input": {
    textAlign: "right",
  },
};

const useStyles = makeStyles(() => ({
  textInput: {
    margin: 0,
    lineHeight: "1.5rem",
  },
  creditContainer: Object.assign({}, creditCell, {
    padding: 4,
    gridArea: "crd",
  }),
}));

const DebitCreditRow = memo(
  ({amount, name, disabled, readOnly, handleBlur, handleCurrencyChange}) => {
    const classes = useStyles();

    const {run: debounced} = useDebounceFn(handleCurrencyChange, 100);
    const handleChange = useCallback(
      ({name, amountType}) =>
        ({floatValue}) => {
          debounced({name, amountType, floatValue});
        },
      [debounced]
    );

    return (
      <div className={classes.creditContainer}>
        <NumberFormat
          allowNegative={false}
          className={classes.textInput}
          customInput={TextField}
          decimalScale={2}
          disabled={disabled}
          fixedDecimalScale
          label="Amount"
          margin="dense"
          name={`${name}.amount`}
          onBlur={handleBlur}
          onValueChange={handleChange({name, amountType: "Credit"})}
          prefix="$"
          readOnly={readOnly}
          thousandSeparator
          value={amount}
        />
      </div>
    );
  }
);

DebitCreditRow.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleCurrencyChange: PropTypes.func,
};

export default DebitCreditRow;
