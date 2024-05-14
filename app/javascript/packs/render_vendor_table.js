// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, noop, noop_array} from "../utils";
import indexOf from "lodash/indexOf";

// Redux
import {Provider} from "react-redux";
import {init} from "@rematch/core";

// HMR
import {AppContainer} from "react-hot-loader";

// Apollo
import {ApolloProvider} from "react-apollo";

// Components
import IndexView from "../components/vendors/index";
import IndexViewModel from "../reducers/models/vendors/index_view.model";
import InvoicesModel from "../reducers/models/vendors/invoices.model";
import VendorsModel from "../reducers/models/vendors/vendors.model";

import PODropdown from "../components/shared/purchase_order_dropdown";

// Redux Saga
import watchEntry from "../sagas/save_entry";
import createSagaMiddleware from "redux-saga";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "vendor-table",
  seed: ["vendor-table", Math.random()].join("-"),
});

// Apollo
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Configure Store
//------------------------------------------------------------------------------
const sagaMiddleware = createSagaMiddleware();
const {vendors = [], invoices = [], purchaseOrders = [], permissions = {}} =
  window.initial_data || {};

const tabs = ["#vendors", "#invoices", "#purchase-orders"];
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
      vendors,
      invoices,
      permissions,
      purchaseOrders,
      index_view: {
        ui: {tabIndex: tabIndex > 0 ? tabIndex : 0},
        vendorFilter: {aasm_state: ""},
        invoiceFilter: {aasm_state: ""},
      },
    },
    reducers: {
      purchaseOrders: noop_array,
      permissions: noop,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("vendor_index");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <StylesProvider generateClassName={generateClassName}>
            <ApolloProvider client={client}>
              <Component />
            </ApolloProvider>
          </StylesProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

const renderInvoiceDropdown = (Component) => {
  const elem = document.getElementById("po_dropdown");
  if (elem) {
    // Render Advanced Editor

    const {
      dataset: {value, vendorId, name},
    } = elem;
    render(
      <AppContainer>
        <StylesProvider generateClassName={generateClassName}>
          <ApolloProvider client={client}>
            <Component {...{value, vendorId, name}} />
          </ApolloProvider>
        </StylesProvider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Index Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(IndexView);
  renderInvoiceDropdown(PODropdown);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/vendors/index", () => {
    renderComponent(IndexView);
  });

  module.hot.accept("../components/shared/purchase_order_dropdown", () => {
    renderInvoiceDropdown(PODropdown);
  });
}
