import {Suspense} from "react";
import {render} from "react-dom";
import {setupApolloClient} from "../utils";
import {ApolloProvider} from "react-apollo";

import siteTheme from "../components/shared/themes/site_theme";
import {ThemeProvider} from "@material-ui/styles";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";

// Components
import routes from "../components/users/routes";
import {Router, View} from "react-navi";

// HMR
import {AppContainer} from "react-hot-loader";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "user-index",
  seed: ["user-index", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("user_index_root");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <ThemeProvider theme={siteTheme}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName}>
              <ScopedCssBaseline />
              <Router routes={routes} basename="/user">
                <Suspense fallback={null}>
                  <Component />
                </Suspense>
              </Router>
            </StylesProvider>
          </ApolloProvider>
        </ThemeProvider>
      </AppContainer>,
      elem
    );
  }
};

// User Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(View);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/users/routes", () => {
    renderComponent(UserRoutes);
  });
}
