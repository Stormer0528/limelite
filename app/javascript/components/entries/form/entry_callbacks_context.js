import {createContext, useState} from "react";
import PropTypes from "prop-types";

const EntryCallbacksContext = createContext({});

const EntryCallbacksProvider = ({value = 0, children}) => {
  const [state, setState] = useState({
    currentEntryIndex: value,
    totals: {all: 0.0},
  });
  return (
    <EntryCallbacksContext.Provider value={[state, setState]}>
      {children}
    </EntryCallbacksContext.Provider>
  );
};

EntryCallbacksProvider.propTypes = {
  value: PropTypes.shape({
    currentEntryIndex: PropTypes.number,
  }),
  children: PropTypes.any,
};

export {EntryCallbacksContext, EntryCallbacksProvider};
