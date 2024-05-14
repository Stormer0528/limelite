// Imports
//------------------------------------------------------------------------------
import FileRouter from "../components/files/router";
import siteTheme from "../components/shared/themes/site_theme";
// JSS
import {noop, setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";
import Container from "@material-ui/core/Container";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import {MuiPickersUtilsProvider as MuiPickersUtilsProvider2} from "@material-ui/pickers";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
import {ThemeProvider} from "@material-ui/styles";
import {init} from "@rematch/core";
// rematch
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
// Apollo
import {ApolloProvider} from "react-apollo";
import {render} from "react-dom";
// import DateFnsUtils from "@date-io/date-fns";
// HMR
import {AppContainer} from "react-hot-loader";
import {Provider} from "react-redux";

// Components

const generateClassName = createGenerateClassName({
  productionPrefix: "files-index",
  seed: ["files-index", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();
const store = init({
  models: {},
  redux: {},
});

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("files_index");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <Provider store={store}>
          <ThemeProvider theme={siteTheme}>
            <MuiPickersUtilsProvider2 utils={DateFnsUtils}>
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
            </MuiPickersUtilsProvider2>
          </ThemeProvider>
        </Provider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(FileRouter);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/files/router", () => {
    renderComponent(FileRouter);
  });
}
