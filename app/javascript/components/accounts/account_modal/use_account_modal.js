import {useContext} from "react";
import {NewAccountModalContext} from "./context";

const useAccountModal = () => {
  const [state = {}, setState] = useContext(NewAccountModalContext);

  function toggleModal() {
    setState((state) => ({...state, open: !state.open}));
  }

  function openModal() {
    setState((state) => ({...state, open: true}));
  }

  function closeModal() {
    setState((state) => ({...state, open: false}));
  }

  function resetAccount() {
    setState((state) => ({...state, account: state.defaultState.account}));
  }

  function setAccount(account) {
    const mergedAccount = {...state.account};

    // Only add non-empty items, or default to default code
    Object.entries(account).forEach(([key, value]) => {
      if (!!value) {
        mergedAccount[key] = value;
      } else {
        mergedAccount[key] = state.defaultState["account"][key];
      }
    });

    setState((state) => ({...state, account: mergedAccount}));
  }

  function setonAccountCreated(onAccountCreated) {
    setState((state) => ({...state, onAccountCreated}));
  }

  return {
    ...state,
    state,
    toggleModal,
    openModal,
    closeModal,
    setAccount,
    resetAccount,
    setonAccountCreated,
  };
};

export default useAccountModal;
