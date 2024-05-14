// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import createSagaMiddleware from "redux-saga";
import {setupApolloClient, siteTheme} from "../utils";
import {ApolloProvider} from "react-apollo";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import {ThemeProvider} from "@material-ui/core/styles";

// Components
import AdminUserList from "../components/admin_user_list";
import PasswordRow from "../components/users/admin_password_row";

// HMR
import {AppContainer} from "react-hot-loader";

// rematch
import {init} from "@rematch/core";
import entryModel from "../reducers/models/entries/entry.model";
import {SnackbarProvider} from "notistack";

// Redux
import {Provider} from "react-redux";
import userModel from "../reducers/models/users/index";
import groupModel from "../reducers/models/groups/index";
import fundModel from "../reducers/models/account_fund/index";
import watchMassSubmit from "../sagas/admin_user_list";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "admin-user-index",
  seed: ["admin-user-index", Math.random()].join("-"),
});

const sagaMiddleware = createSagaMiddleware();

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const initialState = {
  users: userModel.state,
  funds: fundModel.state
};

const store = init({
  models: {
    entry: entryModel, // for TopBar
    users: userModel,
    groups: groupModel,
    funds: fundModel
  },
  redux: {
    initialState,
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchMassSubmit);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("admin_index");
  if (elem) {
    const pageRoot = document.querySelector("body > main");
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

    // Set Organization Id
    store.dispatch({
      type: "users/setOrganization",
      payload: elem.dataset.currentOrgId,
    });

    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ThemeProvider theme={siteTheme}>
                <SnackbarProvider domRoot={pageRoot}>
                  <StylesProvider generateClassName={generateClassName}>
                    <ScopedCssBaseline />
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
                  </StylesProvider>
                </SnackbarProvider>
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      pageRoot
    );
  }
};

const renderPasswordComponent = (Component) => {
  const passElem = document.getElementById("PasswordRow");
  if (passElem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <Component />
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      passElem
    );
  }
};

// User Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(AdminUserList);
  renderPasswordComponent(PasswordRow);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept(
    [
      "../components/admin_user_list",
      "../components/users/routes",
      "../components/topbar",
    ],
    () => {
      renderComponent(AdminUserList);
    }
  );

  module.hot.accept("../components/users/old_edit_view/password_field", () => {
    renderPasswordComponent(PasswordRow);
  });
}
