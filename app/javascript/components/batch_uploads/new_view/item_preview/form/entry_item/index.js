// fund resource year goal function object location
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import {useField} from "formik";
import clsx from "clsx";
import {useCallback} from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import DeleteIcon from "@material-ui/icons/Delete";

import {withStyles} from "@material-ui/core/styles";

import useEntryForm from "../use_entry_form";
import useEntryCallbacks from "../use_entry_callbacks";
import AccountHeader from "./account_header";
import ElementInputs from "./element_inputs";
import DebitCreditRow from "./debit_credit_row";

import currentEntryIndexState from "../current_entry_index.atom";
import {useRecoilValue} from "recoil";

const EntryItemForm = ({
  classes = {},
  disabled = false,
  readOnly = false,
  index,
  name = "",
  validation_errors = [],
  setCurrentEntryIndex = function () {},

  /* Callbacks */
  createRemoveItemHandler = function () {},
}) => {
  const currentEntryIndex = useRecoilValue(currentEntryIndexState);
  const current = index === currentEntryIndex;

  const [{value = {}, onChange, onBlur}, {error = {}}] = useField(name);
  const {handleCurrencyChange} = useEntryForm();
  const {handleBlurValidation} = useEntryCallbacks();

  const {
    accountId,
    accountName,
    functionCode = "",
    fundCode = "",
    goalCode = "",
    locationCode = "",
    credit,
    objectCode = "",
    resourceCode = "",
    valid = true,
    yearCode = "",
  } = value;

  const fieldErrors = error || {};

  const currentEntryIndexHandler = useCallback(() => {
    setCurrentEntryIndex(index, disabled);
  }, [setCurrentEntryIndex, disabled, index]);

  return (
    <div
      data-index={index}
      className={clsx("EntryItem", classes.gridContainer, {
        valid,
        disabled,
        invalid: !valid,
        readonly: readOnly,
        hasAccount: accountId,
        current: current && !disabled,
        [classes.currentRow]: current && !disabled,
      })}
      onClick={currentEntryIndexHandler}
      onBlur={handleBlurValidation({name, index})}
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
          value: {
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
          <ElementInputs
            {...{
              name,
              fieldErrors,
              fundCode,
              resourceCode,
              yearCode,
              goalCode,
              functionCode,
              objectCode,
              locationCode,
              handleChange: onChange,
              handleBlur: onBlur,
            }}
          />
        </div>
      </div>

      <DebitCreditRow
        {...{
          amount: credit,
          name,
          disabled,
          readOnly,
          handleBlur: onBlur,
          handleCurrencyChange,
        }}
      />

      {!readOnly && (
        <div className={classes.deleteContainer}>
          {!disabled && (
            <ButtonBase
              aria-label="Delete"
              className={classes.button}
              onClick={createRemoveItemHandler(index)}
            >
              <DeleteIcon className={classes.buttonIcon} />
            </ButtonBase>
          )}
        </div>
      )}
    </div>
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
  createRemoveItemHandler: PropTypes.func.isRequired,
  setCurrentEntryIndex: PropTypes.func.isRequired,

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

export const styles = () => ({
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(11, 1fr) 48px",
    gridTemplateAreas: `
    "hed hed hed hed hed hed hed hed hed hed hed del"
    "acc acc acc acc acc acc acc acc acc crd crd del"
    `,
    width: "100%",
    height: 84,
    borderTop: "1px solid #f9f9f9",
    borderBottom: "1px solid #eee",
    marginBottom: ".25rem",
    gridAutoRows: "1.75rem 1fr",

    "&:not(.hasAccount)": {
      height: 84,
      gridAutoRows: "1.75rem 1fr",
      gridTemplateAreas: `
      "acc acc acc acc acc acc acc acc acc crd crd del"
      "acc acc acc acc acc acc acc acc acc crd crd del"
      `,
      paddingTop: 0,
    },
    "&.invalid": {
      height: 84,
      gridTemplateAreas: `
      "hed hed hed hed hed hed hed hed hed hed hed del"
      "acc acc acc acc acc acc acc acc acc crd crd del"
      `,
      gridAutoRows: "1.75rem 1fr",
      borderBottom: "2px solid #E53935",
      paddingTop: 0,
    },
    "&.disabled": {
      background: "#efefef",
    },
    "&.disabled.readonly": {
      background: "#FAFAFA",
      gridTemplateAreas: `
      "hed hed hed hed hed hed hed hed hed hed hed hed"
      "acc acc acc acc acc acc acc acc acc acc crd crd"
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
    justifyContent: "center",
  },
  accountElements: {
    display: "grid",
    alignItems: "center",
    justifyContent: "flex-start",
    gridColumnGap: 4,
    gridTemplateColumns:
      "1fr auto 1fr auto 1fr auto 1fr auto 1fr auto 1fr auto 1fr",

    "& > input": {
      flex: "auto 3rem",
      textAlign: "center",
      height: "1.5em !important",
      borderBottom: "none !important",
      boxShadow: "none !important",
      margin: 0,
      font: "inherit",
      color: "currentColor",
      width: "100%",
      border: 0,
      display: "block",
      padding: "6px 0 7px",
      minWidth: 0,
      background: "none",
      boxSizing: "content-box",
      animationName: "MuiInputBase-keyframes-auto-fill-cancel",

      "&::placeholder": {
        textAlign: "center",
        fontWeight: 500,
        color: "#90a4ae",
        fontSize: 12.25,
        padding: "0 0.35em",
        opacity: 0.75,
      },
    },

    "& > span.dash-spacer": {
      flexShrink: 1,
      textAlign: "center",
    },
  },

  deleteContainer: {
    gridArea: "del",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
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
  button: {
    width: "50px",

    "&:hover, &:focus": {
      backgroundColor: "#e2e9ee",
      transition: "background .25s linear",

      "& svg": {
        color: "#607D8B",
      },
    },
  },
  buttonIcon: {
    color: "#ccc",
  },
});

export default withStyles(styles)(EntryItemForm);
