// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import createSagaMiddleware from "redux-saga";
import {setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";

// HMR
import {AppContainer} from "react-hot-loader";

// Redux
import {Provider} from "react-redux";
import watchReport from "../sagas/reports";

// Apollo
import {ApolloProvider} from "react-apollo";

// rematch
import {init} from "@rematch/core";

// Components
import ReportRouter from "../components/reports/router";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "reports",
  seed: ["report", Math.random()].join("-"),
});

const sagaMiddleware = createSagaMiddleware();

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

// State Models
import ReportModel from "../reducers/models/reports/cash_flow_report.model";

// Initial State
const {report = {}} = window.initial_data || {};
// Set up rematch
const store = init({
  models: {
    // index: indexModel
    report: ReportModel,
  },
  redux: {
    initialState: {report},
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchReport);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("router_routes");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Provider store={store}>
            <ApolloProvider client={client}>
              <StylesProvider generateClassName={generateClassName}>
                <Component />
              </StylesProvider>
            </ApolloProvider>
          </Provider>
        </MuiPickersUtilsProvider>
      </AppContainer>,
      elem
    );
  }
};

// Bank Account Page
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(ReportRouter);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/reports/router", () => {
    renderComponent(ReportRouter);
  });
}
