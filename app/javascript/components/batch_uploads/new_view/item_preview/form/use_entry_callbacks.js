import {useCallback} from "react";
import isEmpty from "lodash/isEmpty";
import merge from "lodash/merge";
import {authenticityToken} from "../../../../../utils";
import {useFormikContext} from "formik";

const createValidationWorker = () =>
  new Worker("./validation.worker", {type: "module", globalObject: "self"});

const useEntryCallbacks = () => {
  const {setFieldValue, getFieldProps} = useFormikContext();

  /**
   * vadlidateAccountCode - validates whether whold account string is valid
   *   -- fired from handleBlurValidation when accountElements lose focus
   */
  const vadlidateAccountCode = useCallback(
    (accountCode = {}, callback = function () {}) => {
      //Guard: return if account codes are not set
      if (
        Object.entries(accountCode)
          .filter(([k]) => `${k}`.match(/Code/))
          .every(([, v]) => !v)
      ) {
        return;
      }

      const validationWorker = createValidationWorker();
      validationWorker.onmessage = function ({data: {account}}) {
        // Note: Callback may also update values
        //   -- See handleBlurValidation
        callback(account);
        validationWorker.terminate();
      };

      validationWorker.postMessage({
        validate: "account",
        accountCode,
        authenticityToken: authenticityToken(),
      });
    },
    []
  );

  /**
   * handleBlurValidation - onBlur handler for entryItems
   *     1) validates if the account string is valid
   *     2) sets current entry item
   */
  const handleBlurValidation = useCallback(
    ({name}) => {
      return (e) => {
        e.persist();
        setTimeout(() => {
          const item = e.target.closest(".EntryItem");
          const container = e.target.closest(".EntryItemsContainer");
          const currentItem =
            container && container.querySelector(".EntryItem.current");

          const {dataset: {index: originalIndex} = {}} = item || {};
          const {dataset: {index: currentIndex} = {}} = currentItem || {};

          const isDifferentItemSelected = originalIndex !== currentIndex;
          const isNonCodeInputSelected =
            document.activeElement.name &&
            !document.activeElement.name.includes("Code");
          const {value: vals} = getFieldProps(name);

          if (isDifferentItemSelected || isNonCodeInputSelected) {
            vadlidateAccountCode(vals, (account) => {
              const {value} = getFieldProps(name);
              setFieldValue(
                name,
                merge(value, {
                  ...account,
                  valid: !isEmpty(account),
                  changed: true,
                })
              );
            });
          }
        }, 50);
      };
    },
    [setFieldValue, getFieldProps, vadlidateAccountCode]
  );

  return {handleBlurValidation, vadlidateAccountCode};
};

export default useEntryCallbacks;
