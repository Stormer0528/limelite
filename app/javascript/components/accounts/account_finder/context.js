import {createContext} from "react";

const AccountFinderContext = createContext([{}, () => {}]);

const AccountFinderProvider = ({value, children}) => {
  return (
    <AccountFinderContext.Provider value={value}>
      {children}
    </AccountFinderContext.Provider>
  );
};

export {AccountFinderContext, AccountFinderProvider};
