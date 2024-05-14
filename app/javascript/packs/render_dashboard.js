import {render} from "react-dom";
import {setupApolloClient} from "../utils";
import {ApolloProvider} from "react-apollo";

import siteTheme from "../components/shared/themes/site_theme";
import {ThemeProvider} from "@material-ui/styles";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";

// Components
import Dashboard from "@components/dashboard";

// HMR
import {AppContainer} from "react-hot-loader";

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "Dashboard",
  seed: ["Dashboard", Math.random()].join("-"),
});

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("dashboard");
  if (elem) {
    // Render Advanced Editor
    render(
      <AppContainer>
        <ThemeProvider theme={siteTheme}>
          <ApolloProvider client={client}>
            <StylesProvider generateClassName={generateClassName}>
              <ScopedCssBaseline>
                <Component />
              </ScopedCssBaseline>
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
  renderComponent(Dashboard);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/users/routes", () => {
    renderComponent(Dashboard);
  });
}
