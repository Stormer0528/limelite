// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import VendorQuery from "../../graphql/queries/vendor.gql";
import VendorsQuery from "../../graphql/queries/vendors.gql";

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
  fetchVendors: async () => {
    const {data = {}} = await client.query({
      query: VendorsQuery,
    });
    return {...data};
  },
  fetchVendor: async slug => {
    const {
      data: {filestack, vendorBySlug: vendor = {}} = {},
    } = await client.query({
      query: VendorQuery,
      variables: {slug},
      name: "vendor",
      options: {
        name: "vendor",
      },
    });

    return {vendor, filestack};
  },
};

export default API;
