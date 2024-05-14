import PropTypes from "prop-types";
// import {useEffect} from "react";
import {FieldArray, getIn} from "formik";
import ErrorMessageList from "../../shared/error_message_list";
import {useFormikContext} from "formik";
import KeyboardDate from "@shared/keyboard_date";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Material UI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import EntryIcon from "@material-ui/icons/Receipt";

import useEntryForm, {defaultEntryState} from "./use_entry_form";
import EntryItems from "./entry_items";
import AccountFinder from "../../accounts/account_finder";

import EntryItemsTotals from "./entry_items_totals";
import {AccountFinderProvider} from "../../accounts/account_finder/context";
import {EntryFormProvider} from "./entry_form_context";
import {EntryCallbacksProvider} from "./entry_callbacks_context";
import AccountModal from "../../accounts/account_modal/account_modal";
import UploadBtn from "../../shared/upload_btn_container";
// import Debug from "../../shared/formik_debug";

import {withStyles} from "@material-ui/core/styles";

const EntryForm = ({
  addItemLabel = "+ Item",
  values: {
    defaultDate,
    defaultEntryType,
    currentEntryIndex,
  } = defaultEntryState,
  hideFormHeader = false,
  hideAccountFinder = false,
  hideEntryItemsTotals = false,

  disabled: formDisabled = false,
  readOnly = false,
  disableUpload = false,
  classes = {},
}) => {
  const {
    errors,
    touched,
    handleChange,
    handleBlur,
    isSubmitting = false,
    values: {
      entry: {
        date = defaultDate,
        entryType = defaultEntryType,
        entryItems = [],
        fileUrl,
      } = {},
    },
  } = useFormikContext();

  const disabled = formDisabled || isSubmitting;
  const handleDate = (name) => (date, inputString) => {
    handleChange({
      target: {id: name, name: name, value: date},
    });
  };

  const handleFileUrlChange = (value) => {
    handleChange({target: {name: "entry.fileUrl", value}});
  };

  const {onAccountFinderUpdate, handleAccountFinderUpdate} = useEntryForm();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <AccountFinderProvider
        value={{
          currentEntryIndex,
          onAccountFinderSelect: handleAccountFinderUpdate,
        }}
      >
        <section className={classes.root}>
          {!hideFormHeader && (
            <h5 className={classes.formHeader}>
              <EntryIcon className={classes.headerIcon} /> Entry
            </h5>
          )}

          <ErrorMessageList
            name="entry"
            ignoredKeys={["date", "entryType", "entryItems"]}
          />

          <Grid
            container
            spacing={1}
            alignItems="center"
            alignContent="center"
            className={classes.root}
            key="items"
          >
            <Grid item sm={4} md={3} lg={2} className={classes.dateControl}>
              <KeyboardDate
                fullWidth
                label="Date"
                value={date}
                disabled={disabled}
                readOnly={readOnly}
                onChange={handleDate("entry.date")}
                inputProps={{
                  className: "browser-default",
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  !!getIn(touched, "entry.date") &&
                  !!getIn(errors, "entry.date")
                }
                helperText={
                  getIn(touched, "entry.date") && getIn(errors, "entry.date")
                }
              />
            </Grid>
            <Grid item sm={4} md={3} lg={2}>
              <TextField
                select
                label="Entry Type"
                className={classes.selectControl}
                value={entryType || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                readOnly={readOnly}
                SelectProps={{
                  inputProps: {
                    id: "entry.entryType",
                    name: "entry.entryType",
                    classes: {disabled: classes.selectDisabled},
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={
                  !!getIn(touched, "entry.entryType") &&
                  !!getIn(errors, "entry.entryType")
                }
                helperText={
                  getIn(touched, "entry.entryType") &&
                  getIn(errors, "entry.entryType")
                }
              >
                <MenuItem value="Transaction" key="Transaction">
                  Transaction
                </MenuItem>
                <MenuItem value="Payroll" key="Payroll">
                  Payroll
                </MenuItem>
                <MenuItem value="Accounts Payable" key="AccountsPayable">
                  Accounts Payable
                </MenuItem>
                <MenuItem value="Revenue" key="Revenue">
                  Revenue
                </MenuItem>
                <MenuItem value="Accounts Receivable" key="AccountsReceivable">
                  Accounts Receivable
                </MenuItem>
                <MenuItem value="Journal Entry" key="JournalEntry">
                  Journal Entry
                </MenuItem>
                <MenuItem value="Beginning Balance" key="BeginningBalance">
                  Beginning Balance
                </MenuItem>
                <MenuItem value="Payment" key="Payment">
                  Payment
                </MenuItem>
              </TextField>
            </Grid>
            {
              !disableUpload && <Grid item sm className={classes.fileBtnCell}>
                <UploadBtn
                  name="entry.fileUrl"
                  onChange={handleFileUrlChange}
                  value={fileUrl}
                />
              </Grid> || <></>
            }
          </Grid>
          <FieldArray name="entry.entryItems">
            {({remove}) => {
              return (
                <EntryItems
                  name="entry.entryItems"
                  {...{addItemLabel, readOnly, disabled, remove}}
                />
              );
            }}
          </FieldArray>
          {!hideEntryItemsTotals && (
            <EntryItemsTotals {...{entryItems, disabled, readOnly}} />
          )}
          {!hideAccountFinder && (
            <AccountFinder
              {...{
                setCurrentEntryItemCode: handleAccountFinderUpdate,
                onAccountFinderUpdate,
                onAccountFinderSelect: handleAccountFinderUpdate,
                onAccountCreated: onAccountFinderUpdate,
              }}
            />
          )}
          <AccountModal />
        </section>
      </AccountFinderProvider>
    </MuiPickersUtilsProvider>
  );
};

EntryForm.propTypes = {
  values: PropTypes.shape({
    date: PropTypes.string,
    entryType: PropTypes.string,
    entryItems: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  errors: PropTypes.object,
  touched: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  addItemLabel: PropTypes.string,
  hideAccountFinder: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  hideFormHeader: PropTypes.bool,
  hideEntryItemsTotals: PropTypes.bool,

  classes: PropTypes.object,
};

const styles = (theme) => ({
  formHeader: {
    background: "#f5f5f5",
    borderBottom: "1px solid #CFD8DC",
    color: "#607D8B",
    display: "flex",
    fontSize: "1.64rem",
    margin: "0 -14px 0.25em",
    padding: ".5rem 1em",
  },
  headerIcon: {
    position: "relative",
    top: "1px",
    marginRight: ".25em",
  },
  titleHeader: {
    borderBottom: "1px solid #b8c9d0",
    paddingBottom: "0.25em",
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    margin: "0.25em 0 0",
  },
  icon: {
    color: "#78909C",
  },
  text: {
    flex: "auto",
    marginLeft: ".325rem",
  },
  entryItemsContainer: {
    maxHeight: "50vh",
    overflowY: "auto",
  },
  root: {
    background: "#FAFAFA99",
    margin: "0 -8px",
    padding: "0 1em 1em",
  },
  selectDisabled: {
    color: "#333",
  },
  fileBtnCell: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dateInputProps: {
    padding: "6px 0 7px",
  },
});

const FormWithProviders = (props) => {
  return (
    <EntryCallbacksProvider>
      <EntryFormProvider>
        <EntryForm {...props} />
      </EntryFormProvider>
    </EntryCallbacksProvider>
  );
};

export default withStyles(styles)(FormWithProviders);
