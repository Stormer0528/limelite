// Imports
//------------------------------------------------------------------------------
import {render} from "react-dom";
import {setupApolloClient, searchToObject, getFiscalYear} from "../utils";

// Apollo
import {ApolloProvider} from "react-apollo";
import UDATE_FISCAL_YEAR_MUTATION from "../graphql/mutations/update_fiscal_year.gql";

// HMR
import {AppContainer} from "react-hot-loader";

// Components
import AccountsPage from "../components/accounts/index_page";

// Configure Store
//------------------------------------------------------------------------------
const client = setupApolloClient();

import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";

const generateClassName = createGenerateClassName({
  productionPrefix: "accont-index",
  seed: ["accont-index", Math.random()].join("-"),
});

// Default Params
//------------------------------------------------------------------------------
const {endDate, account: accountStr = "{}"} = searchToObject(
  window.location.search
);

const {
  fundCode = "",
  resourceCode = "",
  yearCode = "",
  goalCode = "",
  functionCode = "",
  objectCode = "",
  locationCode = "",
} = JSON.parse(accountStr);

if (endDate) {
  client.mutate({
    mutation: UDATE_FISCAL_YEAR_MUTATION,
    variables: {
      year: getFiscalYear(endDate),
    },
  });
}

// Render Components
//------------------------------------------------------------------------------
const renderComponent = (Component) => {
  const elem = document.getElementById("accounts_index");
  if (elem) {
    // Render Component
    render(
      <AppContainer>
        <ApolloProvider client={client}>
          <StylesProvider generateClassName={generateClassName}>
            <Component
              defaultState={{
                fundCode,
                resourceCode,
                yearCode,
                goalCode,
                functionCode,
                objectCode,
                locationCode,
              }}
            />
          </StylesProvider>
        </ApolloProvider>
      </AppContainer>,
      elem
    );
  }
};

// Vendor Table
document.addEventListener("DOMContentLoaded", () => {
  renderComponent(AccountsPage);
});

// Update from HMR Calls
if (module.hot) {
  module.hot.accept("../components/accounts/index_page", () => {
    renderComponent(AccountsPage);
  });
}
