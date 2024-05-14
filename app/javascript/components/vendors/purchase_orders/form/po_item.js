import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import TextField from "./styled_textfield";
import NumberFormat from "react-number-format";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const POItem = (props) => {
  const {
    index,
    field: {name, errors = {}, touched = {}},
    form: {handleChange = function () {}, handleBlur = function () {}},
    value: values = {},
    value: {priceInCents = 0},
    helpers: {handleRemove = function () {}},
    disabled = false,
    readOnly = false,
    classes = {},
  } = props;

  const handleAmountChange = (name) => ({floatValue: value}) => {
    handleChange({target: {name, value}});
  };

  const handlePriceChange = (name) => ({floatValue}) => {
    const value = parseInt((floatValue * 100).toFixed(0), 10);
    handleChange({target: {name, value}});
  };

  const calculateTotal = () => {
    const {priceInCents = 0, quantity = 0} = values;
    return (priceInCents * quantity) / 100;
  };

  const price = priceInCents / 100;

  return (
    <section>
      <Grid container spacing={2}>
        <Grid item xs sm={2} lg={1} className={classes.formCell}>
          <NumberFormat
            allowNegative={false}
            customInput={TextField}
            decimalScale={0}
            disabled={disabled}
            fixedDecimalScale
            fullWidth
            id={`${name}.quantity`}
            label="Qty"
            name="item.quantity"
            onBlur={handleBlur}
            onValueChange={handleAmountChange(`${name}.quantity`)}
            readOnly={readOnly}
            thousandSeparator
            value={values.quantity}
            variant="outlined"
          />
        </Grid>
        <Grid item xs className={classes.formCell}>
          <TextField
            disabled={disabled}
            fullWidth
            id={`${name}.description`}
            InputProps={{readOnly, className: classes.textareaInput}}
            label="Description"
            multiline
            name={`${name}.description`}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            variant="outlined"
            readOnly={readOnly}
          />
        </Grid>
        <Grid item xs sm={3} md={2} className={classes.formCell}>
          <NumberFormat
            customInput={TextField}
            decimalScale={2}
            disabled={disabled}
            error={!!errors.price && !!touched.price}
            fixedDecimalScale
            fullWidth
            helperText={touched.price && errors.price}
            inputProps={{className: classes.basicOutlineInput}}
            label="Unit Price"
            name={`${name}.priceInCents`}
            onBlur={handleBlur}
            onValueChange={handlePriceChange(`${name}.priceInCents`)}
            prefix="$"
            readOnly={readOnly}
            thousandSeparator
            value={price}
            variant="outlined"
          />
        </Grid>
        <Grid item xs sm={3} md={2} className={classes.formCell}>
          <NumberFormat
            customInput={TextField}
            decimalScale={2}
            disabled
            error={!!errors.amount && !!touched.amount}
            fixedDecimalScale
            fullWidth
            InputLabelProps={{
              classes: {shrink: classes.filledLabel},
            }}
            InputProps={{readOnly: true, className: classes.filledInput}}
            inputProps={{className: classes.basicInput}}
            label="Total"
            prefix="$"
            readOnly
            thousandSeparator
            value={calculateTotal()}
            variant="filled"
          />
        </Grid>
        {!readOnly && (
          <Grid item className={classes.formCell}>
            {!disabled && (
              <IconButton
                aria-label="Delete"
                className={classes.button}
                onClick={handleRemove(index)}
              >
                <DeleteIcon className={classes.buttonIcon} />
              </IconButton>
            )}
          </Grid>
        )}
      </Grid>
    </section>
  );
};

POItem.propTypes = {
  index: PropTypes.number,
  field: PropTypes.shape({
    name: PropTypes.string,
    errors: PropTypes.object,
    touched: PropTypes.object,
  }),
  form: PropTypes.shape({
    handleChange: PropTypes.func.isRequired,
    handleBlur: PropTypes.func.isRequired,
  }),
  value: PropTypes.object,
  helpers: PropTypes.shape({
    handleRemove: PropTypes.func,
  }),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  textareaInput: {
    padding: "1px 0 !important",
  },
  outlinedInput: {
    padding: "18.5px 14px !important",
  },
  filledInput: {
    borderRadius: "4px",

    "& input": {
      padding: "16px 14px 4px !important",
    },

    "&:after, &:before, &:hover:after, &:hover:before": {
      borderBottom: "none !important",
    },
  },
  filledLabel: {
    transform: "translate(12px, 4px) scale(0.75) !important",
  },
  basicInput: {
    padding: "18.5px 14px 0 !important",
    color: "#292929 !important",
  },
  basicOutlineInput: {
    padding: "9.25px 14px 9.25px  !important",
  },
  button: {
    position: "relative",
    top: "-.25em",
  },
});

export default withStyles(styles)(POItem);
