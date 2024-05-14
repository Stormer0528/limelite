import PropTypes from "prop-types";
import {useCallback} from "react";

import EntryForm from "../entries/form/entry_form";
import useEntryForm from "../entries/form/use_entry_form";

import {NewAccountModalProvider} from "../accounts/account_modal/context";

const Form = ({addItemLabel, handleChange, handleBlur, setFieldValue}) => {
  const {onAccountFinderUpdate} = useEntryForm();

  const handleOnAccountCreated = useCallback(
    ({account}) => onAccountFinderUpdate(account),
    [onAccountFinderUpdate]
  );

  return (
    <NewAccountModalProvider
      value={{
        onAccountCreated: handleOnAccountCreated,
        onAccountFinderSelect: handleOnAccountCreated,
        handleOnAccountCreated,
      }}
    >
      <EntryForm
        {...{
          addItemLabel,
          handleChange,
          handleBlur,
          setFieldValue,
          handleOnAccountCreated,
        }}
      />
    </NewAccountModalProvider>
  );
};

Form.propTypes = {
  addItemLabel: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default Form;
