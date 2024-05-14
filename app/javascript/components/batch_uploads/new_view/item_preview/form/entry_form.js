import PropTypes from "prop-types";
import {FieldArray} from "formik";
import {useFormikContext} from "formik";

// Material UI
import useEntryForm, {defaultEntryState} from "./use_entry_form";
import EntryItems from "./entry_items";
import AccountFinder from "../../../../accounts/account_finder";

import {AccountFinderProvider} from "../../../../accounts/account_finder/context";
import {EntryFormProvider} from "./entry_form_context";
import {EntryCallbacksProvider} from "./entry_callbacks_context";
import AccountModal from "../../../../accounts/account_modal/account_modal";
// import Debug from "@shared/formik_debug";

import {withStyles} from "@material-ui/core/styles";

const EntryForm = ({
  name = "",
  addItemLabel = "+ Item",
  values: {currentEntryIndex = 0} = defaultEntryState,
  hideAccountFinder = false,

  disabled: formDisabled = false,
  readOnly = false,
  classes = {},
}) => {
  const {isSubmitting = false} = useFormikContext();

  const disabled = formDisabled || isSubmitting;
  const {onAccountFinderUpdate, handleAccountFinderUpdate} = useEntryForm();
  const afName = `${name}.entryItems`;
  return (
    <AccountFinderProvider
      value={{
        currentEntryIndex,
        onAccountFinderSelect: handleAccountFinderUpdate(afName),
      }}
    >
      <section className={classes.root}>
        <FieldArray name={`${name}.entryItems`}>
          {({remove}) => {
            return (
              <EntryItems
                name={`${name}.entryItems`}
                {...{addItemLabel, readOnly, disabled, remove}}
              />
            );
          }}
        </FieldArray>
        {!hideAccountFinder && (
          <AccountFinder
            {...{
              setCurrentEntryItemCode: handleAccountFinderUpdate(afName),
              onAccountFinderUpdate: onAccountFinderUpdate(afName),
              onAccountFinderSelect: handleAccountFinderUpdate(afName),
              onAccountCreated: onAccountFinderUpdate(afName),
            }}
          />
        )}
        <AccountModal />
      </section>
    </AccountFinderProvider>
  );
};

EntryForm.propTypes = {
  values: PropTypes.shape({
    entryItems: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  name: PropTypes.string,
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
