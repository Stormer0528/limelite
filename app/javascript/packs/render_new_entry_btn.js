// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {SnackbarProvider} from "notistack";
// Redux
import {Provider} from "react-redux";
import NotificationsStore, {
  defaultState as defaultNotificationsState,
} from "../reducers/notifications_reducer";
import watchEntry from "../sagas/save_entry";

// Rematch
import {init} from "@rematch/core";
import createSagaMiddleware from "redux-saga";

// Models
import accountFinderModel from "../reducers/models/entries/account_finder.model";
import accountElementsModel from "../reducers/models/entries/account_elements.model";
import entryModel from "../reducers/models/entries/entry.model";

// Apollo
import {ApolloProvider} from "react-apollo";

// HMR
import {AppContainer} from "react-hot-loader";

// Components
import NewEntryBtn from "../components/new_entry_btn";
import FiscalYearDropdown from "../components/topbar/fiscal_year_selector";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "addEntry",
  seed: ["addEntry", Math.random()].join("-"),
});

const generateClassName1 = createGenerateClassName({
  productionPrefix: "fiscalDropdown",
  seed: ["fiscalDropdown", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const sagaMiddleware = createSagaMiddleware();

const initialState = Object.assign(
  {},
  {notifications: defaultNotificationsState}
);

// Set up rematch
const store = init({
  models: {
    entry: entryModel,
    account_finder: accountFinderModel,
    account_elements: accountElementsModel,
  },
  redux: {
    initialState,
    reducers: {
      notifications: NotificationsStore,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("addEntry");

  const {importEntries} = elem.dataset;

  if (elem) {
    // Render Component
    const pageRoot = document.querySelector("main.container");
    render(
      <AppContainer>
        <SnackbarProvider domRoot={pageRoot}>
          <Provider store={store}>
            <ApolloProvider client={client}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <StylesProvider generateClassName={generateClassName}>
                  <Component canimportEntries={importEntries === "true"} />
                </StylesProvider>
              </MuiPickersUtilsProvider>
            </ApolloProvider>
          </Provider>
        </SnackbarProvider>
      </AppContainer>,
      elem
    );
  }
};

const renderFiscalYearComponent = (Component) => {
  const elem = document.getElementById("fiscalDropdown");
  if (elem) {
    const fiscalYear = parseInt(elem.dataset.fiscalYear);
    const earliestFiscalYear = parseInt(elem.dataset.earliestFiscalYear);
    const latestFiscalYear = parseInt(elem.dataset.latestFiscalYear);

    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName1}>
              <Component
                {...{fiscalYear, earliestFiscalYear, latestFiscalYear}}
              />
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
  renderComponent(NewEntryBtn);
  renderFiscalYearComponent(FiscalYearDropdown);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/new_entry_btn/index", () => {
    renderComponent(NewEntryBtn);
  });

  module.hot.accept("../components/topbar/fiscal_year_selector/index", () => {
    renderFiscalYearComponent(FiscalYearDropdown);
  });
}
