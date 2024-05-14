import {connect} from "react-redux";
import {pure} from "recompose";
import set from "lodash/set";
import {compose} from "redux";

import Api from "./api";

import EntryItem from "../../new_entry_btn/entry_item";

export const mapStateToProps = (state, props) => {
  return {};
};

export const mapDispatchToProps = (dispatch, props) => {
  const {
    index,
    name,
    handleChange,
    aryHelpers: {
      form: {values: prevValues, setValues, setFieldValue},
    },
    entryItemBlurHandlerCallback = function () {},
  } = props;

  const changeHandler = () => props.handleChange;

  const multiUpdate = (values) => {
    const updatedValues = Object.entries(values).reduce(
      (obj, {[0]: key, [1]: value}) => {
        const updated = set(obj, `${name}.${key}`, value);
        return updated;
      },
      {...prevValues}
    );
    setValues(updatedValues);
  };

  return {
    createFundChangeHandler: changeHandler,
    createFunctionChangeHandler: changeHandler,
    createGoalChangeHandler: changeHandler,
    createLocationChangeHandler: changeHandler,
    createObjectChangeHandler: changeHandler,
    createResourceChangeHandler: changeHandler,
    createYearChangeHandler: changeHandler,
    createMemoChangeHandler: changeHandler,
    createCreditChangeHandler: () => ({floatValue}) => {
      if (!floatValue) {
        return;
      }

      handleChange({target: {name: `${name}.type`, value: "Credit"}});
      handleChange({target: {name: `${name}.credit`, value: floatValue}});
      handleChange({target: {name: `${name}.debit`, value: ""}});
      handleChange({target: {name: `${name}.amount`, value: floatValue}});
      handleChange({target: {name: `${name}.changed`, value: true}});
    },
    createDebitChangeHandler: () => ({floatValue}) => {
      if (!floatValue) {
        return;
      }
      handleChange({target: {name: `${name}.type`, value: "Debit"}});
      handleChange({target: {name: `${name}.debit`, value: floatValue}});
      handleChange({target: {name: `${name}.credit`, value: ""}});
      handleChange({target: {name: `${name}.amount`, value: floatValue}});
      handleChange({target: {name: `${name}.changed`, value: true}});
    },
    createEntryItemPayableIdChangeHandler: () => (response) => {
      const {id: payableId, payableType} = response;
      multiUpdate({payableId, payableType});
    },
    createBlurHandler: (accountCode = {}) => async () => {
      setFieldValue("entry.currentEntryIndex", index);

      //Guard: return if account codes are not set
      if (
        Object.entries(accountCode)
          .filter(([k]) => `${k}`.match(/Code/))
          .every(([, v]) => !v)
      ) {
        return;
      }

      const account = await Api.validateAccount(accountCode);
      const {
        id: accountId,
        name: accountName,
        functionCode,
        fundCode,
        goalCode,
        locationCode,
        objectCode,
        resourceCode,
        yearCode,
      } = account || {};

      multiUpdate({
        accountId,
        accountName,
        valid: !!account,
      });

      if (account) {
        multiUpdate({
          functionCode,
          fundCode,
          goalCode,
          locationCode,
          objectCode,
          resourceCode,
          yearCode,
        });
      }

      setTimeout(() => {
        entryItemBlurHandlerCallback(account);
      }, 50);
    },
    createNewAccountHandler: (id) => () => {
      dispatch.account_finder.setAccountModalOpen(true);
      dispatch.account_finder.setAccountModalId(id);
    },
    createCurrentEntryIndexHandler: (index = 0, disabled = false) => () => {
      !disabled && setFieldValue("entry.currentEntryIndex", index);
    },
  };
};

export default compose(
  pure,
  connect(mapStateToProps, mapDispatchToProps)
)(EntryItem);
