// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, noop_array} from "../utils";

// HMR
import {AppContainer} from "react-hot-loader";

// Apollo
import {ApolloProvider} from "react-apollo";

// Redux
import {Provider} from "react-redux";
import indexOf from "lodash/indexOf";

// rematch
import {init} from "@rematch/core";

// Components
import IndexView from "../components/customers/index";
import IndexViewModel from "../reducers/models/customers/index_view.model";
import InvoicesModel from "../reducers/models/customers/invoices.model";
import VendorsModel from "../reducers/models/customers/customers.model";

// Redux Saga
import watchEntry from "../sagas/save_entry";
import createSagaMiddleware from "redux-saga";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "customer-index",
  seed: ["customer-index", Math.random()].join("-"),
});

// Apollo
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Configure Store
//------------------------------------------------------------------------------
const sagaMiddleware = createSagaMiddleware();

const tabs = ["#vendors", "#invoices"];
const tabIndex = indexOf(tabs, window.location.hash) || 0;

// Set up rematch
const store = init({
  models: {
    index_view: IndexViewModel,
    invoices: InvoicesModel,
    vendors: VendorsModel,
  },
  redux: {
    initialState: {
      index_view: {
        ...IndexViewModel.state,
        ui: {tabIndex: tabIndex > 0 ? tabIndex : 0},
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
const renderComponent = Component => {
  const elem = document.getElementById("customer_index");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName}>
              <Component />
            </StylesProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Bank Account Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(IndexView);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/customers/index", () => {
    renderComponent(IndexView);
  });
}
