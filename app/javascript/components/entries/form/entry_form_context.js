import {createContext, useState} from "react";
import PropTypes from "prop-types";

const EntryFormContext = createContext({});

const EntryFormProvider = ({value = 0, children}) => {
  const [state, setState] = useState({
    currentEntryIndex: value,
    totals: {all: 0.0, total: {balance: "$0.00"}},
  });
  return (
    <EntryFormContext.Provider value={[state, setState]}>
      {children}
    </EntryFormContext.Provider>
  );
};

EntryFormProvider.propTypes = {
  value: PropTypes.shape({
    currentEntryIndex: PropTypes.number,
  }),
  children: PropTypes.any,
};

export {EntryFormContext, EntryFormProvider};
