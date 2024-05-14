// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import CustomerQuery from "../../graphql/queries/customer.gql";
import CustomersQuery from "../../graphql/queries/customers.gql";

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

const API = {
  fetchCustomers: async () => {
    const {data = {}} = await client.query({
      query: CustomersQuery,
    });
    return {...data};
  },
  fetchCustomer: async slug => {
    const {data: {customerBySlug: customer = {}} = {}} = await client.query({
      query: CustomerQuery,
      variables: {slug},
      name: "customer",
      options: {
        name: "customer",
      },
    });

    return {customer};
  },
};

export default API;
