// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, noop, noop_array} from "../utils";

// Redux
import {Provider} from "react-redux";

// rematch
import {init} from "@rematch/core";

// HMR
import {AppContainer} from "react-hot-loader";

// Apollo
import {ApolloProvider} from "react-apollo";

// Models
import filterModel from "../reducers/models/entries/entry_table.model";

// Components
import AccountsPage from "../components/entries/entries_table_container";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "entries-table",
  seed: ["entries-table", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const {initial_data: {entries = [], account = {}} = {}} = window;

const initialState = Object.assign({}, {entries, account});

// Set up rematch
const store = init({
  models: {
    filter: filterModel,
  },
  redux: {
    initialState,
    reducers: {
      account: noop,
      entries: noop_array,
    },
  },
});

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("accountEntriesTable");
  if (elem) {
    const {fiscalYear} = elem.dataset;
    store.dispatch({
      type: "filter/setAfterDateFilter",
      payload: `${parseInt(fiscalYear)}-07-01`,
    });

    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName}>
              <Component {...{account}} />
            </StylesProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(AccountsPage);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/accounts", () => {
    renderComponent(AccountsPage);
  });
}
