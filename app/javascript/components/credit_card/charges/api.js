// Graphql
import {authenticityToken} from "../../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

// import CHARGE_QUERY from "../../../graphql/queries/load_charge.gql";
// import CREATE_CHARGE_MUTATION from "../../../graphql/mutations/create_charge.gql";
// import UPDATE_CHARGE_MUTATION from "../../../graphql/mutations/update_charge.gql";

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

// Charges API
export default {
  fetchCharge: async (slug) => {
    // const {data = {}} = await client.query({
    //   query: CHARGE_QUERY,
    //   variables: {slug},
    //   options: {},
    // });
    // console.log("Charge", data);
    // return {charge: {}};
  },
  // createCharge: async ({Charge, stateAction = "save_draft", reason = ""}) => {
  //   const {data: {createCharge: response} = {}} = await client.mutate({
  //     mutation: CREATE_CHARGE_MUTATION,
  //     variables: {Charges, stateAction, reason},
  //   });

  //   console.log("Create Charge", response);

  //   return response;
  // },
  // updateCharge: async ({Charge, stateAction = "save_draft", reason = ""}) => {
  //   const {data: {updateCharges: response} = {}} = await client.mutate({
  //     mutation: UPDATE_CHARGE_MUTATION,
  //     variables: {Charge, stateAction, reason},
  //   });

  //   console.log("Update Charge", response);

  //   return response;
  // },
};
