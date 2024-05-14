// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {merge} from "lodash";
import createSagaMiddleware from "redux-saga";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {MuiPickersUtilsProvider as MuiPickersUtilsProvider2} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import siteTheme from "../components/shared/themes/site_theme";
import {ThemeProvider} from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

// HMR
import {AppContainer} from "react-hot-loader";

// Apollo
import {ApolloProvider} from "react-apollo";

// rematch
import {init} from "@rematch/core";

// Components
import {Provider} from "react-redux";
import CreditCardRouter from "../components/credit_card/router";
import statementModel from "../reducers/models/credit_card/statement.model";
import creditCardModel from "../reducers/models/credit_card/credit_card.model";

// JSS
import watchEntry from "../sagas/save_entry";
import {noop, setupApolloClient} from "../utils";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "credit-card-index",
  seed: ["credit-card-index", Math.random()].join("-"),
});

const sagaMiddleware = createSagaMiddleware();

// Configure Store
//------------------------------------------------------------------------------
const {account_data: accounts = [], filestack} = window.initial_data || {};
const client = setupApolloClient();

const initialState = merge(
  {
    credit_card: creditCardModel.state,
  },
  {
    credit_card: {accounts},
    filestack,
  }
);

// Set up rematch
const store = init({
  models: {
    statement: statementModel,
    credit_card: creditCardModel,
  },
  redux: {
    initialState,
    reducers: {
      filestack: noop,
    },
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
// sagaMiddleware.run(watchBankAccount);
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("credit_card_index");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <ThemeProvider theme={siteTheme}>
          <MuiPickersUtilsProvider2 utils={DateFnsUtils}>
            <Provider store={store}>
              <ApolloProvider client={client}>
                <NewMuiPickersUtilsProvider utils={DateFnsUtils}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <StylesProvider generateClassName={generateClassName}>
                      <Container fixed>
                        <Component />
                      </Container>
                    </StylesProvider>
                  </MuiPickersUtilsProvider>
                </NewMuiPickersUtilsProvider>
              </ApolloProvider>
            </Provider>
          </MuiPickersUtilsProvider2>
        </ThemeProvider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(CreditCardRouter);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/credit_card/router", () => {
    renderComponent(CreditCardRouter);
  });
}
