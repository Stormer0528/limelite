// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import USER_QUERY from "../../graphql/queries/account_elements.gql";
// import CREATE_USER_MUTATION from "../../graphql/queries/load_user.gql";
// import UPDATE_USER_MUTATION from "../../graphql/mutations/users/update_user.gql";

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

// Users API
export default {
  fetchUser: async (slug) => {
    const {data = {}} = await client.query({
      query: USER_QUERY,
      variables: {slug},
      options: {},
    });

    return {};
  },
  // createUser: async ({User, stateAction = "save_draft", reason = ""}) => {
  //   const {data: {createUser: response} = {}} = await client.mutate({
  //     mutation: CREATE_USER_MUTATION,
  //     variables: {Users, stateAction, reason},
  //   });
  //
  //   console.log("Create User", response);
  //
  //   return response;
  // },
  // updateUser: async ({User, stateAction = "save_draft", reason = ""}) => {
  //   const {data: {updateUsers: response} = {}} = await client.mutate({
  //     mutation: UPDATE_USER_MUTATION,
  //     variables: {User, stateAction, reason},
  //   });
  //
  //   console.log("Update User", response);
  //
  //   return response;
  // },
};
