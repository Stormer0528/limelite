// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient} from "../utils";
import DateFnsUtils from "@date-io/date-fns";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import {MuiPickersUtilsProvider as NewMuiPickersUtilsProvider} from "@material-ui/pickers";
import {SnackbarProvider} from "notistack";

import siteTheme from "../components/shared/themes/site_theme";
import {ThemeProvider} from "@material-ui/styles";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";

// Apollo
import {ApolloProvider} from "react-apollo";

// HMR
import {AppContainer} from "react-hot-loader";

// Components
import BatchUploadRoutes from "@components/batch_uploads/router";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "BatchUploads",
  seed: ["BatchUploads", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("batch-upload-root");

  if (elem) {
    // Render Component
    const pageRoot = document.querySelector("main");
    render(
      <AppContainer>
        <ThemeProvider theme={siteTheme}>
          <NewMuiPickersUtilsProvider utils={DateFnsUtils}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <SnackbarProvider domRoot={pageRoot}>
                <ApolloProvider client={client}>
                  <StylesProvider generateClassName={generateClassName}>
                    <ScopedCssBaseline>
                      <Component />
                    </ScopedCssBaseline>
                  </StylesProvider>
                </ApolloProvider>
              </SnackbarProvider>
            </MuiPickersUtilsProvider>
          </NewMuiPickersUtilsProvider>
        </ThemeProvider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(BatchUploadRoutes);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/batch_uploads/router", () => {
    renderComponent(BatchUploadRoutes);
  });
}
