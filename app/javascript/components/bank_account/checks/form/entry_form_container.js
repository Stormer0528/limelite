import EntryForm from "../../../entries/form/entry_form";
import useEntryForm from "../../../entries/form/use_entry_form";
import {NewAccountModalProvider} from "../../../accounts/account_modal/context";

const EntryFormContainer = (props) => {
  const {handleAccountFinderUpdate} = useEntryForm();

  return (
    <NewAccountModalProvider
      value={{handleOnAccountCreated: handleAccountFinderUpdate}}
    >
      <EntryForm {...props} />
    </NewAccountModalProvider>
  );
};

export default EntryFormContainer;
