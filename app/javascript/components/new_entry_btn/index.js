// New Entry Button
//------------------------------------------------------------------------------
// Note: Redux handles open/closed state
//       Formik handles entry state
//       -- default state can be set in entries/form/use_entry_form
//
// Structure:
//  <FinderDialogContainer>     ─ handles formik form and open/close handlers
//   ├── <FinderDialog>         ─ displays dialog, dialog btns, page header and "upload entries" btn
//                                    also has <AccountModalProvider>
//  └───── <FinderDialogInner>  ─ displays DialogContent and EntryForm
//------------------------------------------------------------------------------

import {connect} from "react-redux";

import {contentDidLoad} from "../../actions/account_actions";
import {setOpen} from "../../actions/notifications_actions";
import {calculateBalance} from "../../reducers/entry_reducer";

import NewEntryBtn from "./new_entry_btn";
import isValid from "date-fns/isValid";

// Validation Methods
//------------------------------------------------------------------------------
export function validateEntry(entry) {
  const validations = [
    validateRequiredFields(entry),
    validateEntryItemsAmount(entry.items),
    validateEntryItemsAccountId(entry.items),
    validateZeroBalance(entry.items),
  ];

  return validations.every((check) => check === true);
}

export function validateZeroBalance(entry_items = []) {
  const balance = calculateBalance(entry_items);
  const adjustedBalance = Number.parseFloat(balance).toFixed(2);

  return adjustedBalance === "0.00";
}

export function validateRequiredFields(entry = {}) {
  return isValid(new Date(entry.date));
}

export function validateEntryItemsAmount(items = []) {
  // has has non-zero amount
  return items.every(({debit = 0.0, credit = 0.0}) => {
    return parseInt(debit * 100) !== 0 || parseInt(credit * 100) !== 0;
  });
}

export function validateEntryItemsAccountId(items = []) {
  // has has non-zero amount
  return items.every(({accountId}) => {
    return !!accountId;
  });
}

const mapStateToProps = ({
  notifications,
  entry,
  data: {
    functions,
    funds,
    goals,
    locations,
    objects,
    resources,
    years,
    loading = false,
  } = {},
}) => {
  return {
    open,
    notifications,
    functions,
    funds,
    goals,
    locations,
    objects,
    resources,
    years,
    loading,
    valid: validateEntry(entry),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleContentLoad: (content) => {
      dispatch(contentDidLoad(content));
    },
    handleSnackbarRequestClose: () => {
      dispatch(setOpen());
    },
    handleOpenDialog: () => {
      dispatch.account_finder.toggleModalOpen(false);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEntryBtn);
