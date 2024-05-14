// import "../components/shared/why_did_you_update";
// Imports
//------------------------------------------------------------------------------
// Components
import EntryInput from "../components/entry_input/index";
import entryModel from "../reducers/models/entries/entry.model";
import PaymentStore, {
  defaultState as defaultPaymentState,
} from "../reducers/payment_reducer";
import watchEntry from "../sagas/save_entry";
import {setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
// rematch
import {init} from "@rematch/core";
import merge from "lodash/merge";
// Apollo
import {ApolloProvider} from "react-apollo";
import {render} from "react-dom";
// HMR
import {AppContainer} from "react-hot-loader";
// Redux
import {Provider} from "react-redux";
import createSagaMiddleware from "redux-saga";

const generateClassName = createGenerateClassName({
  productionPrefix: "entry-input",
  seed: ["entry-input", Math.random()].join("-"),
});
// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

const {
  initial_data = {},
  initial_data: {
    entry = {},
    defaultObjectCode = "9500",
    defaultAutofillType = "Credit",
    defaultEntryType = "Transaction",
  },
} = window;
const sagaMiddleware = createSagaMiddleware();

const {entry: {items} = {}} = initial_data;
const initialState = merge(
  {
    entry: Object.assign({}, entryModel.state, entry, {
      defaultObjectCode: `${defaultObjectCode}`,
      defaultAutofillType: `${defaultAutofillType}`,
      items,
    }),
    payment: defaultPaymentState,
  },
  {
    entry: {
      entryType: `${defaultEntryType}`,
      type: `${defaultEntryType}`,
    },
  }
);

// Set up rematch
const store = init({
  models: {
    entry: entryModel,
  },
  redux: {
    initialState,
    reducers: {
      payment: PaymentStore,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("entry_input");
  const {parentClass, invoiceRemaining, addItemLabel} = elem.dataset;

  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName}>
              <NewMuiPickersUtilsProvider utils={DateFnsUtils}>
                <Component
                  {...{
                    parent_class: parentClass,
                    invoiceRemaining,
                    addItemLabel,
                    initialState,
                  }}
                />
              </NewMuiPickersUtilsProvider>
            </StylesProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Render Component when ready
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(EntryInput);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/entry_input", () => {
    renderComponent(EntryInput);
  });
}
