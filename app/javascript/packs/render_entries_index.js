// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, searchToObject} from "../utils";
import merge from "lodash/merge";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";

// Redux
import {Provider} from "react-redux";
import watchEntry from "../sagas/save_entry";

// rematch
import {init} from "@rematch/core";
import createSagaMiddleware from "redux-saga";

// Models
import entryModel from "../reducers/models/entries/index_view.model";

import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {createTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import {siteTheme} from "../utils";

// Apollo
import {ApolloProvider} from "react-apollo";

// HMR
import {AppContainer} from "react-hot-loader";

// Components
import EntriesIndex from "../components/entries/views/index";
import EntriesShow from "../components/entries/show_view";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "entries-index",
  seed: ["entries-index", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const {initial_data: {organization} = {}} = window;

const {
  startDate,
  endDate,
  account: accountStr = "{}",
} = searchToObject(window.location.search);
const account = JSON.parse(accountStr);

const sagaMiddleware = createSagaMiddleware();

const initialState = merge(
  {index: {...entryModel.state}},
  {index: {organization}},
  {
    index: {
      filter: {
        start_date: startDate,
        end_date: endDate,
        dateFilter: "Between",
        account,
      },
    },
  }
);

// Set up rematch
const store = init({
  models: {
    index: entryModel,
  },
  redux: {
    initialState,
    middlewares: [sagaMiddleware],
  },
});

// Run Saga
sagaMiddleware.run(watchEntry);

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("entries_index");
  if (elem) {
    const {fiscalYear} = elem.dataset;

    // Only set fiscal year filter if no search params
    if (!window.location.search) {
      store.dispatch({
        type: "index/setDateToggle",
        payload: "After",
      });
      store.dispatch({
        type: "index/setAfterDateFilter",
        payload: `${parseInt(fiscalYear)}-07-01`,
      });
    }

    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <NewMuiPickersUtilsProvider utils={DateFnsUtils}>
            <ApolloProvider client={client}>
              <StylesProvider generateClassName={generateClassName}>
                <Component />
              </StylesProvider>
            </ApolloProvider>
          </NewMuiPickersUtilsProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

const renderShowComponent = (Component) => {
  const elem = document.getElementById("entries_show");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <ThemeProvider theme={createTheme(siteTheme)}>
                <StylesProvider generateClassName={generateClassName}>
                  <Component />
                </StylesProvider>
              </ThemeProvider>
            </MuiPickersUtilsProvider>
          </ApolloProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Entries Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(EntriesIndex);
  renderShowComponent(EntriesShow);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../packs/render_entries_index", () => {
    renderComponent(EntriesIndex);
    renderShowComponent(EntriesShow);
  });
}
