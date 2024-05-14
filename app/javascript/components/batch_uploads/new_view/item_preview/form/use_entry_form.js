import {useCallback} from "react";
import produce from "immer";
import currentEntryIndexState from "./current_entry_index.atom";

import set from "lodash/set";
import clamp from "lodash/clamp";

import {useRecoilValue, useSetRecoilState} from "recoil";
import {useFormikContext} from "formik";

export const amtBase = {
  amount: 0,
  memo: "",
  changed: false,
  touched: false,
  valid: true,
};

const defaultEntryItem = {debit: 0, type: "Debit", ...amtBase};

export const defaultEntryState = {
  date: `${new Date()}`,
  entryType: "Journal Entry",
  entryItems: [{...defaultEntryItem}, {credit: 0, type: "Credit", ...amtBase}],
  aasmState: "draft",
  defaultObjectCode: "9500",
  defaultAutofillType: "Credit",
};

const useEntryForm = () => {
  const currentEntryIndex = useRecoilValue(currentEntryIndexState);
  const currentEntryIndexSetter = useSetRecoilState(currentEntryIndexState);

  const {
    setValues,
    setFieldValue,
    getFieldProps,
    values: prevValues,
    values: {
      entry: {entryItems, entryItems: {length: entryItemsLength} = []} = {},
    },
  } = useFormikContext();

  const setCurrentEntryIndex = useCallback(
    (index, disabled = false) => {
      if (disabled) {
        return;
      }

      const newIndex = clamp(index, 0, entryItemsLength);
      currentEntryIndexSetter(newIndex);
    },
    [currentEntryIndexSetter, entryItemsLength]
  );

  const multiUpdate = useCallback(
    (itemName, values = {}) => {
      const updatedValues = produce(prevValues, (draft) => {
        Object.entries(values).forEach(([key, value]) => {
          const name = `${itemName}.${key}`;
          set(draft, name, value);
        });
      });

      setValues(updatedValues);
    },
    [setValues, prevValues]
  );

  const handleCurrencyChange = useCallback(
    ({name, amountType, floatValue}) => {
      if (!floatValue) {
        return;
      }

      const {value} = getFieldProps(name);
      setFieldValue(name, {
        ...value,
        type: amountType,
        amount: floatValue,
        changed: true,
        [`${amountType.toLocaleLowerCase()}`]: floatValue,
        [`${amountType === "Credit" ? "debit" : "credit"}`]: "",
      });
    },
    [getFieldProps, setFieldValue]
  );

  const addEntryItem = useCallback(
    (e) => {
      e.preventDefault();

      setFieldValue("entry.entryItems", [...entryItems, defaultEntryItem]);
      setCurrentEntryIndex(entryItems.length);
    },
    [setFieldValue, setCurrentEntryIndex, entryItems]
  );

  const onAccountFinderUpdate = useCallback(
    (valueName) => (account) => {
      const {
        name,
        name: accountName,
        id: accountId,
        functionCode,
        fundCode,
        goalCode,
        locationCode,
        objectCode,
        resourceCode,
        yearCode,
      } = account;

      multiUpdate(`${valueName}[${currentEntryIndex}]`, {
        functionCode,
        fundCode,
        goalCode,
        accountId,
        locationCode,
        accountName,
        objectCode,
        resourceCode,
        yearCode,
        name,
        valid: true,
        changed: true,
      });
    },
    [multiUpdate, currentEntryIndex]
  );

  const handleAccountFinderUpdate = useCallback(
    (name = "entry.entryItems") => ({
      account,
      onAccountFinderUpdate = function () {},
    }) => {
      const {
        name: accountName,
        id: accountId,
        functionCode,
        fundCode,
        goalCode,
        locationCode,
        objectCode,
        resourceCode,
        yearCode,
      } = account;
      multiUpdate(`${name}[${currentEntryIndex}]`, {
        name: accountName,
        functionCode,
        fundCode,
        goalCode,
        accountId,
        locationCode,
        accountName,
        objectCode,
        resourceCode,
        yearCode,
        valid: true,
        changed: true,
      });

      if (account) {
        onAccountFinderUpdate(account);
      }
    },
    [multiUpdate, currentEntryIndex]
  );

  return {
    addEntryItem,
    currentEntryIndex,
    handleAccountFinderUpdate,
    handleCurrencyChange,
    multiUpdate,
    onAccountFinderUpdate,
    setCurrentEntryIndex,
  };
};

export default useEntryForm;
