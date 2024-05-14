// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import STATEMENT_QUERY from "../../graphql/queries/statements/load_statement.gql";
import CREATE_STATEMENT_MUTATION from "../../graphql/mutations/statements/create_statement.gql";
import UPDATE_STATEMENT_MUTATION from "../../graphql/mutations/statements/update_statement.gql";

// Set up client for graphql
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link: createHttpLink({
    uri: "/graphql",
    headers: {
      "X-CSRF-Token": authenticityToken(),
    },
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({fragmentMatcher}),
});

// Statements API
export default {
  fetchStatement: async (slug) => {
    const {data = {}} = await client.query({
      query: STATEMENT_QUERY,
      variables: {slug},
      options: {},
    });

    console.log("Statement", data);

    return {Statement};
  },
  createStatement: async ({
    Statement,
    stateAction = "save_draft",
    reason = "",
  }) => {
    const {data: {createStatement: response} = {}} = await client.mutate({
      mutation: CREATE_STATEMENT_MUTATION,
      variables: {Statements, stateAction, reason},
    });

    console.log("Create Statement", response);

    return response;
  },
  updateStatement: async ({
    Statement,
    stateAction = "save_draft",
    reason = "",
  }) => {
    const {data: {updateStatements: response} = {}} = await client.mutate({
      mutation: UPDATE_STATEMENT_MUTATION,
      variables: {Statement, stateAction, reason},
    });

    console.log("Update Statement", response);

    return response;
  },
};
