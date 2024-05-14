import {Suspense} from "react";
import {ApolloProvider} from "react-apollo";
import merge from "lodash/merge";
import {Provider} from "react-redux";

import {Router} from "react-navi";

// import routes from "../../bank_account/routes";
// import BankAccountRouter from "../../bank_account/router";

import {setupApolloClient, noop} from "../../../utils";
import HelmetProvider from "react-navi-helmet-async";
import {init} from "@rematch/core";
// import statementRoutes from "../../reconciliations/routes";
import statementModel from "../../../reducers/models/bank_account/statement.model";
import bankAccountModel from "../../../reducers/models/bank_account/bank_account.model";
import accountFinderModel from "../../../reducers/models/entries/account_finder.model";
import accountElementsModel from "../../../reducers/models/entries/account_elements.model";

const client = setupApolloClient();

const initialState = merge(
  {
    bank: bankAccountModel.state,
  },
  {filestack: {}, permissions: {}}
);

// Set up rematch
const store = init({
  models: {
    statement: statementModel,
    bank: bankAccountModel,
    account_finder: accountFinderModel,
    account_elements: accountElementsModel,
  },
  redux: {
    initialState,
    reducers: {
      permissions: noop,
    },
  },
});

export default function (storyFn) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <Router basename="/" context={{permissions: {}}}>
            <Suspense fallback={null}>{storyFn()}</Suspense>
          </Router>
        </HelmetProvider>
      </ApolloProvider>
    </Provider>
  );
}
