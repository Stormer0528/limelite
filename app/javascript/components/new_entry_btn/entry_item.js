// fund resource year goal function object location
//------------------------------------------------------------------------------
import useAccountModal from "../accounts/account_modal/use_account_modal";
import useEntryForm from "../entries/form/use_entry_form";
import VendorCustomerInput from "../shared/vendor_customer_input";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import clsx from "clsx";
import PropTypes from "prop-types";
import {useCallback} from "react";
import NumberFormat from "react-number-format";

const EntryItemForm = ({
  accountId,
  accountName,
  classes = {},
  credit,
  current,
  debit,
  disabled = false,
  functionCode = "",
  fundCode = "",
  goalCode = "",
  id,
  index,
  locationCode = "",
  memo,
  name = "entry",
  objectCode = "",
  payableId,
  payableName,
  payableType,
  readOnly = false,
  resourceCode = "",
  valid = true,
  validation_errors = [],
  yearCode = "",
  /* Callbacks */
  createCreditChangeHandler = function () {},
  createDebitChangeHandler = function () {},
  createFundChangeHandler = function () {},
  createFunctionChangeHandler = function () {},
  createGoalChangeHandler = function () {},
  createLocationChangeHandler = function () {},
  createObjectChangeHandler = function () {},
  createResourceChangeHandler = function () {},
  createYearChangeHandler = function () {},
  createMemoChangeHandler = function () {},
  createCurrentEntryIndexHandler = function () {},
  createRemoveItemHandler = function () {},
  createBlurHandler = function () {},
  createNewAccountHandler = function () {},
  createEntryItemPayableIdChangeHandler = function () {},
}) => {
  /**
   * handleChangeFocus - Move selection to next input when finished
   */
  const handleChangeFocus = useCallback(
    ({maxChars = 4, nextElemName}) =>
      ({target, target: {value = ""} = {}}) => {
        if (value.length >= maxChars && target.selectionStart === maxChars) {
          target.parentElement
            .querySelector(`input[name="${nextElemName}"]`)
            .select();
        }
      },
    [] /* handleChangeFocus Dependencies */
  );
  const formatFunc = (num) => `${num}`;

  return (
    <Fade in>
      <div
        className={clsx("EntryItem", classes.gridContainer, {
          valid,
          disabled,
          invalid: !valid,
          readonly: readOnly,
          hasAccount: accountId,
          [classes.currentRow]: current && !disabled,
        })}
        onClick={createCurrentEntryIndexHandler(index || id, disabled)}
        onBlur={createBlurHandler({
          id,
          index,
          fundCode,
          functionCode,
          goalCode,
          locationCode,
          objectCode,
          resourceCode,
          yearCode,
        })}
      >
        {validation_errors.length > 0 && (
          <ul className="">
            {validation_errors.map((error, i) => {
              return <li key={i}>{error}</li>;
            })}
          </ul>
        )}
        <AccountHeader
          {...{
            id: index,
            itemName: name,
            name: accountName,
            valid,
            disabled,
            readOnly,
            createNewAccountHandler,
            values: {
              index,
              fundCode,
              functionCode,
              goalCode,
              locationCode,
              objectCode,
              resourceCode,
              yearCode,
            },
          }}
          className={classes.accountHeader}
        />
        <div className={classes.account}>
          <div className={classes.accountElements}>
            <NumberFormat
              onChange={createFundChangeHandler(index)}
              onKeyUp={handleChangeFocus({
                nextElemName: `${name}.resourceCode`,
              })}
              name={`${name}.fundCode`}
              type="tel"
              min="0"
              maxLength="4"
              placeholder="Fund"
              value={fundCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createResourceChangeHandler(index)}
              name={`${name}.resourceCode`}
              onKeyUp={handleChangeFocus({nextElemName: `${name}.yearCode`})}
              type="tel"
              min="0"
              maxLength="4"
              placeholder="Resource"
              value={resourceCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createYearChangeHandler(index)}
              onKeyUp={handleChangeFocus({
                maxChars: 1,
                nextElemName: `${name}.goalCode`,
              })}
              name={`${name}.yearCode`}
              type="tel"
              min="0"
              maxLength="1"
              placeholder="Year"
              value={yearCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createGoalChangeHandler(index)}
              onKeyUp={handleChangeFocus({
                nextElemName: `${name}.functionCode`,
              })}
              name={`${name}.goalCode`}
              type="tel"
              min="0"
              maxLength="4"
              placeholder="Goal"
              value={goalCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createFunctionChangeHandler(index)}
              onKeyUp={handleChangeFocus({
                nextElemName: `${name}.objectCode`,
              })}
              name={`${name}.functionCode`}
              type="tel"
              min="0"
              maxLength="4"
              placeholder="Function"
              value={functionCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createObjectChangeHandler(index)}
              onKeyUp={handleChangeFocus({
                nextElemName: `${name}.locationCode`,
              })}
              name={`${name}.objectCode`}
              type="tel"
              min="0"
              maxLength="4"
              placeholder="Object"
              value={objectCode}
              style={{marginBottom: "none"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
            <span className="dash-spacer">&ndash;</span>
            <NumberFormat
              onChange={createLocationChangeHandler(index)}
              name={`${name}.locationCode`}
              type="tel"
              min="0"
              maxLength={3}
              placeholder={"School"}
              value={locationCode}
              style={{marginBottom: "none", minWidth: "3rem"}}
              format={formatFunc}
              isNumericString={true}
              disabled={disabled}
              readOnly={readOnly}
            />
          </div>
        </div>
        <div className={classes.memoRow}>
          <div className={classes.memo}>
            <TextField
              name={`${name}.memo`}
              placeholder="Memo"
              value={memo}
              fullWidth
              onChange={createMemoChangeHandler(index)}
              disabled={disabled}
              readOnly={readOnly}
            />
          </div>
          <VendorCustomerInput
            {...{payableId, payableName, payableType, disabled, readOnly}}
            onChange={createEntryItemPayableIdChangeHandler(index)}
            className={classes.vendorInput}
          />
        </div>

        <div className={classes.debitContainer}>
          <NumberFormat
            name="debit"
            label="Debit"
            margin="dense"
            className={classes.textInput}
            value={debit}
            onValueChange={createDebitChangeHandler(index)}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
        <div className={classes.creditContainer}>
          <NumberFormat
            name="credit"
            label="Credit"
            margin="dense"
            className={classes.textInput}
            value={credit}
            onValueChange={createCreditChangeHandler(index)}
            customInput={TextField}
            thousandSeparator
            prefix="$"
            decimalScale={2}
            fixedDecimalScale
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>

        {!readOnly && (
          <div className={classes.deleteContainer}>
            {!disabled && (
              <IconButton
                aria-label="Delete"
                className={classes.button}
                onClick={createRemoveItemHandler(index)}
              >
                <DeleteIcon className={classes.buttonIcon} />
              </IconButton>
            )}
          </div>
        )}
      </div>
    </Fade>
  );
};

// PropTypes
//------------------------------------------------------------------------------
EntryItemForm.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  accountName: PropTypes.string,
  credit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  current: PropTypes.bool,
  debit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  memo: PropTypes.string,
  name: PropTypes.string,
  payableId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  payableName: PropTypes.string,
  payableType: PropTypes.string,
  valid: PropTypes.bool,
  readOnly: PropTypes.bool,
  validation_errors: PropTypes.array,

  /* Account Codes */
  accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  goalCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fundCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  functionCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  locationCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  objectCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  resourceCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yearCode: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  /* Callbacks */
  createCreditChangeHandler: PropTypes.func.isRequired,
  createDebitChangeHandler: PropTypes.func.isRequired,
  createRemoveItemHandler: PropTypes.func.isRequired,
  createFundChangeHandler: PropTypes.func.isRequired,
  createFunctionChangeHandler: PropTypes.func.isRequired,
  createGoalChangeHandler: PropTypes.func.isRequired,
  createLocationChangeHandler: PropTypes.func.isRequired,
  createObjectChangeHandler: PropTypes.func.isRequired,
  createResourceChangeHandler: PropTypes.func.isRequired,
  createYearChangeHandler: PropTypes.func.isRequired,
  createMemoChangeHandler: PropTypes.func.isRequired,
  createCurrentEntryIndexHandler: PropTypes.func.isRequired,
  createNewAccountHandler: PropTypes.func.isRequired,
  createBlurHandler: PropTypes.func.isRequired,
  createEntryItemPayableIdChangeHandler: PropTypes.func.isRequired,
  /* Styles */
  classes: PropTypes.object,
};

// Styles
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

export const styles = (theme) => ({
  gridContainer: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "repeat(11, 1fr) 48px",
    gridTemplateAreas: `
    "hed hed hed hed hed hed hed foo foo foo foo del"
    "acc acc acc acc acc acc acc dbt dbt crd crd del"
    "mem mem mem mem mem mem mem dbt dbt crd crd del"
    `,
    gridAutoRows: "1fr 1fr 40px",
    marginBottom: ".25rem",
    borderTop: "1px solid #f9f9f9",
    borderBottom: "1px solid #eee",

    "&:not(.hasAccount)": {
      gridAutoRows: "1fr 50px",
      gridTemplateAreas: `
      "acc acc acc acc acc acc acc dbt dbt crd crd del"
      "mem mem mem mem mem mem mem dbt dbt crd crd del"
      `,
    },
    "&.invalid": {
      gridTemplateAreas: `
      "hed hed hed hed hed hed hed hed hed hed hed del"
      "acc acc acc acc acc acc acc dbt dbt crd crd del"
      "mem mem mem mem mem mem mem dbt dbt crd crd del"
      `,
      gridAutoRows: "36px 1fr 40px",
      borderBottom: "2px solid #E53935",
    },

    "&.disabled": {
      background: "#efefef",
    },
    "&.disabled.readonly": {
      background: "#FAFAFA",
      gridTemplateAreas: `
      "hed hed hed hed hed hed hed hed hed hed hed hed"
      "acc acc acc acc acc acc acc acc dbt dbt crd crd"
      "mem mem mem mem mem mem mem mem dbt dbt crd crd"
      `,
      "& input": {
        color: "#333",
      },
    },
  },
  account: {
    gridArea: "acc",
    display: "flex",
    flexDirection: "column",
  },
  accountElements: {
    display: "grid",
    alignItems: "center",
    justifyContent: "flex-start",
    gridTemplateColumns:
      "1fr auto 1fr auto 1fr auto 1fr auto 1fr auto 1fr auto 1fr",

    "& > input": {
      flex: "auto 3rem",
      textAlign: "center",
      height: "1.5em !important",

      "&:first-of-type": {
        textAlign: "left",
        paddingLeft: "8px",
      },

      "&::placeholder": {
        textAlign: "center",
        color: "#b0bec5",
        fontSize: "0.8rem",
        fontWeight: "200",
        padding: "0 0.35em",
      },
    },

    "& > span.dash-spacer": {
      flexShrink: 1,
      textAlign: "center",
    },
  },

  memoRow: {
    gridArea: "mem",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "stretch",
  },
  vendorRow: {
    flexGrow: "1",
  },
  vendorInput: {},
  memo: {
    padding: "0 8px 8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flexGrow: "2",

    "& input::placeholder": {
      fontSize: ".9em",
      fontWeight: "normal",
    },
  },
  creditContainer: Object.assign({}, creditCell, {
    padding: "8px",
    gridArea: "crd",
  }),
  debitContainer: Object.assign({}, debitCell, {
    padding: "8px",
    gridArea: "dbt",
  }),
  deleteContainer: {
    gridArea: "del",
    display: "flex",
  },
  currentRow: {
    background: "#03a9f40d",
    borderBottom: "1px solid #03a9f487",
    transition: "opacity, background, border 225ms ease-in !important",
  },
  textInput: {
    margin: 0,
    lineHeight: "1.5rem",
  },
  formControl: {
    margin: "0 1em 0 0",
    width: "100%",
  },
  button: {
    boxShadow: "none !important",
    backgroundColor: "transparent !important",
    "&:hover": {
      color: "red",
    },
  },
  buttonIcon: {
    color: "#ccc",
  },
});

export default withStyles(styles)(EntryItemForm);

// Helper Functions
//------------------------------------------------------------------------------

export const AccountHeader = ({
  id,
  name,
  valid,
  className,
  readOnly,
  ...rest
}) => {
  if (valid === false) {
    // Invalid Account
    return <InvalidHeader {...{id, className, ...rest}} />;
  } else if (name && valid) {
    // Valid Account
    return <ValidHeader {...{name, readOnly, className}} />;
  }

  // Empty Account
  return null;
};

AccountHeader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  valid: PropTypes.bool,
  createNewAccountHandler: PropTypes.func.isRequired,
};

const ValidHeader = ({name, readOnly}) => (
  <Grid
    item
    style={{
      gridColumnStart: 1,
      gridColumnEnd: readOnly ? -1 : -2,
      gridRow: 1,
      background: "#F5F5F5",
      paddingLeft: "8px",
      borderBottom: "2px solid #fff",
      zIndex: 2,

      ".disabled.readonly &": {
        gridColumnEnd: -1,
      },
    }}
  >
    <Typography variant="subtitle1">
      <b>{name}</b>
    </Typography>
  </Grid>
);

ValidHeader.propTypes = {
  name: PropTypes.string,
  readOnly: PropTypes.bool,
};

const InvalidHeader = ({itemName, values = {}}) => {
  const {setAccount, setonAccountCreated, openModal} = useAccountModal();

  const {multiUpdate} = useEntryForm();
  const handleClick = useCallback(() => {
    const handleOnAccountCreated = (account) => {
      multiUpdate(itemName, {...account, accountName: account.name});
    };

    setAccount(values);
    setonAccountCreated(handleOnAccountCreated);
    openModal();
  }, [
    itemName,
    multiUpdate,
    openModal,
    setAccount,
    setonAccountCreated,
    values,
  ]);

  return (
    <Grid item style={headerStyles.invalidStyles}>
      <Grid container alignItems="center" justify="space-between" spacing={1}>
        <Grid item style={{flexGrow: 1}}>
          <Typography variant="subtitle1">
            <b style={{color: "#B71C1C"}}>Account Not Found</b>
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            style={headerStyles.createBtn}
            onClick={handleClick}
          >
            + Create Account
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

InvalidHeader.propTypes = {
  /* itemName: (object path) to the currenty Entry item, same as name var in EntryItem */
  itemName: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  /* values: account codes passed to new account modal */
  values: PropTypes.shape({
    fundCode: PropTypes.string,
    resourceCode: PropTypes.string,
    yearCode: PropTypes.string,
    goalCode: PropTypes.string,
    functionCode: PropTypes.string,
    objectCode: PropTypes.string,
    locationCode: PropTypes.string,
  }),
};

const headerStyles = {
  invalidStyles: {
    paddingLeft: "8px",
    color: "#B71C1C",
    backgroundColor: "#FCE4EC",
    gridArea: "hed / hed / hed / hed",
    marginBottom: "4px",
  },
  createBtn: {
    padding: ".125rem .5rem",
    margin: ".125rem 0",
    background: "#fef7f9",
    marginRight: ".125rem",
  },
};
