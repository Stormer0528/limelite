import {createContext, useState} from "react";
import PropTypes from "prop-types";

const NewAccountModalContext = createContext([]);

const defaultState = {
  open: false,
  onAccountCreated: function () {},
  account: {
    fundCode: "0000",
    resourceCode: "0000",
    yearCode: "0",
    goalCode: "0000",
    functionCode: "0000",
    objectCode: "0000",
    locationCode: "00",
  },
};

const NewAccountModalProvider = ({value = {}, children}) => {
  const [state, setState] = useState({...defaultState, defaultState, ...value});
  return (
    <NewAccountModalContext.Provider value={[state, setState]}>
      {children}
    </NewAccountModalContext.Provider>
  );
};

NewAccountModalProvider.propTypes = {
  value: PropTypes.shape({
    open: PropTypes.bool,
    onAccountCreated: PropTypes.func,
    account: PropTypes.shape({
      fundCode: PropTypes.string,
      functionCode: PropTypes.string,
      locationCode: PropTypes.string,
      yearCode: PropTypes.string,
      goalCode: PropTypes.string,
    }),
  }),
  children: PropTypes.any,
};

export {NewAccountModalContext, NewAccountModalProvider};
