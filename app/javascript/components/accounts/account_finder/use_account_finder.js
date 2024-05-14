import {useContext} from "react";
import {AccountFinderContext} from "./context";

const useAccountModal = () => {
  const [state, setState] = useContext(AccountFinderContext);

  function setValues(values) {
    setState(state => ({...state, values}));
  }

  return {
    setValues,
    values: state.values,
  };
};

export default useAccountModal;
