// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, noop_array} from "../utils";
import indexOf from "lodash/indexOf";
import {Suspense} from "react";
import {ThemeProvider} from "@material-ui/core/styles";
import siteTheme from "@shared/themes/site_theme";
// Redux
import {Provider} from "react-redux";
import {Router, View} from "react-navi";
import {init} from "@rematch/core";

// HMR
import {AppContainer} from "react-hot-loader";

// Apollo
import {ApolloProvider} from "react-apollo";

// Components
import IndexView from "../components/vendors/show_view";
import IndexViewModel from "../reducers/models/vendors/index_view.model";
import filterModel from "../reducers/models/vendors/entry_table.model";

import routes from "../components/customers/routes";

// Redux Saga
import watchEntry from "../sagas/save_entry";
import createSagaMiddleware from "redux-saga";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "customer-show",
  seed: ["customer-show", Math.random()].join("-"),
});

// Apollo
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Configure Store
//------------------------------------------------------------------------------
const sagaMiddleware = createSagaMiddleware();

const tabs = ["#vendors", "#invoices", "#purchase-orders"];
const tabIndex = indexOf(tabs, window.location.hash) || 0;

// Set up rematch
const store = init({
  models: {
    index_view: IndexViewModel,
    entryFilter: filterModel,
    invoiceFilter: filterModel,
    purchseOrderFilter: filterModel,
  },
  redux: {
    initialState: {
      index_view: {
        ui: {tabIndex: tabIndex > 0 ? tabIndex : 0},
        vendorFilter: {aasm_state: ""},
        invoiceFilter: {aasm_state: ""},
      },
    },
    reducers: {
      purchaseOrders: noop_array,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("customer-show-view");
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
            <ThemeProvider theme={siteTheme}>
              <StylesProvider generateClassName={generateClassName}>
                <Router routes={routes} basename="/customers">
                  <Suspense fallback={null}>
                    <Component />
                  </Suspense>
                </Router>
              </StylesProvider>
            </ThemeProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Bank Account Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(View);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/customers/show_view", () => {
    renderComponent(IndexView);
  });
}
