// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {SnackbarProvider} from "notistack";

import siteTheme from "../components/shared/themes/site_theme";
import {ThemeProvider} from "@material-ui/styles";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";

// Redux
import {Provider} from "react-redux";

// Rematch
import {init} from "@rematch/core";

// Models
import accountFinderModel from "../reducers/models/entries/account_finder.model";
import accountElementsModel from "../reducers/models/entries/account_elements.model";
import entryModel from "../reducers/models/entries/entry.model";

import NotificationsStore, {
  defaultState as defaultNotificationsState,
} from "../reducers/notifications_reducer";

// Apollo
import {ApolloProvider} from "react-apollo";

// HMR
import {AppContainer} from "react-hot-loader";

// Components
import TopBar from "../components/topbar";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "TopBar",
  seed: ["TopBar", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
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
  },
});

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("top-navbar");
  const currentYear = new Date().getFullYear();
  const {
    importEntries,
    title = "",
    logoPath = "",
    /* Refactor */
    earliestFiscalYear = "2016",
    fiscalYear = `${currentYear}`,
    latestFiscalYear = `${currentYear}`,
  } = elem.dataset;

  if (elem) {
    // Render Component
    const pageRoot = document.querySelector("main");
    render(
      <AppContainer>
        <ThemeProvider theme={siteTheme}>
          <SnackbarProvider domRoot={pageRoot}>
            <Provider store={store}>
              <ApolloProvider client={client}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <StylesProvider generateClassName={generateClassName}>
                    <ScopedCssBaseline>
                      <Component
                        canimportEntries={importEntries === "true"}
                        {...{
                          title,
                          logoPath,
                          earliestFiscalYear: parseInt(earliestFiscalYear),
                          fiscalYear: parseInt(fiscalYear),
                          latestFiscalYear: parseInt(latestFiscalYear),
                        }}
                      />
                    </ScopedCssBaseline>
                  </StylesProvider>
                </MuiPickersUtilsProvider>
              </ApolloProvider>
            </Provider>
          </SnackbarProvider>
        </ThemeProvider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(TopBar);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/topbar", () => {
    renderComponent(TopBar);
  });
}
