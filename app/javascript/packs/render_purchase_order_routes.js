// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import merge from "lodash/merge";
import createSagaMiddleware from "redux-saga";
import {setupApolloClient, noop, siteTheme} from "../utils";
import {Suspense} from "react";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import {ThemeProvider} from "@material-ui/core/styles";

import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

// HMR
import {AppContainer} from "react-hot-loader";

// Redux
import {Provider} from "react-redux";

// Apollo
import {ApolloProvider} from "react-apollo";

// rematch
import {init} from "@rematch/core";

import {Router, View} from "react-navi";
import routes from "../components/vendors/purchase_orders/routes";

// Components
import NewView from "../components/vendors/purchase_orders/new_view";

const sagaMiddleware = createSagaMiddleware();

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const {account_data: filestack, permissions} = window.initial_data || {};

const initialState = merge({}, {filestack, permissions});

// Set up rematch
const store = init({
  redux: {
    initialState,
    reducers: {
      filestack: noop,
      permissions: noop,
    },
    middlewares: [sagaMiddleware],
  },
});

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("purchase_orders_index");

  // Render Advanced Editor
  render(
    <AppContainer>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={siteTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Router
                routes={routes}
                basename="/vendors/:vendor_id/purchase_orders"
                context={{permissions}}
              >
                <Suspense fallback={null}>
                  <ScopedCssBaseline>
                    <Component />
                  </ScopedCssBaseline>
                </Suspense>
              </Router>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </AppContainer>,
    elem
  );
};

// Bank Account Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(View);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/vendors/purchase_orders/new_view", () => {
    renderComponent(NewView);
  });
}
