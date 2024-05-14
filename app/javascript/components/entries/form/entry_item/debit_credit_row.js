/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {Fragment, memo, useCallback} from "react";
import NumberFormat from "react-number-format";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {useDebounceFn} from "@umijs/hooks";

export const debitCell = {
  background: "#FFEBEE",
  color: "#B71C1C",
  border: "2px solid #B71C1C",
  borderWidth: " 0 1px 0 2px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",

  "& input": {
    textAlign: "right",
  },
};

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

const useStyles = makeStyles((theme) => ({
  textInput: {
    margin: 0,
    lineHeight: "1.5rem",
  },
  creditContainer: Object.assign({}, creditCell, {
    padding: "8px 8px 4px",
    gridArea: "crd",
  }),
  debitContainer: Object.assign({}, debitCell, {
    padding: "8px 8px 4px",
    gridArea: "dbt",
  }),
}));

const DebitCreditRow = memo(
  ({
    credit,
    debit,
    name,
    disabled,
    readOnly,
    handleBlur,
    handleCurrencyChange,
  }) => {
    const classes = useStyles();

    const {run: debounced} = useDebounceFn(handleCurrencyChange, 100);
    const handleChange = useCallback(
      ({name, amountType}) => ({floatValue}) => {
        debounced({name, amountType, floatValue});
      },
      [debounced]
    );

    return (
      <Fragment>
        <div className={classes.debitContainer}>
          <NumberFormat
            name="debit"
            label="Debit"
            margin="dense"
            className={classes.textInput}
            value={debit}
            onValueChange={handleChange({name, amountType: "Debit"})}
            onBlur={handleBlur}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
        <div className={classes.creditContainer}>
          <NumberFormat
            name={`${name}.credit`}
            label="Credit"
            margin="dense"
            className={classes.textInput}
            value={credit}
            onValueChange={handleChange({name, amountType: "Credit"})}
            onBlur={handleBlur}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
      </Fragment>
    );
  }
);

DebitCreditRow.propTypes = {
  credit: PropTypes.number,
  debit: PropTypes.number,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleCurrencyChange: PropTypes.func,
};

export default DebitCreditRow;
