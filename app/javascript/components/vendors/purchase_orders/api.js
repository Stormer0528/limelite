// Graphql
import {authenticityToken} from "../../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import introspectionQueryResultData from "../../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import VENDOR_QUERY from "@graphql/queries/purchase_orders/load_vendor.gql";
import PURCHASE_ORDER_QUERY from "@graphql/queries/purchase_orders/load_purchase_order.gql";

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

// Purchase Order API
export default {
  fetchVendor: async (slug) => {
    const {
      data: {
        vendor,
        filestack,
        vendorPermissions,
        purchaseOrderPermissions,
      } = {},
    } = await client.query({
      query: VENDOR_QUERY,
      variables: {slug},
      name: "vendor",
      options: {
        name: "vendor",
      },
    });
    return {vendor, filestack, vendorPermissions, purchaseOrderPermissions};
  },

  fetchPurchaseOrder: async ({vendor_id, purchase_order_id}) => {
    const {data = {}} = await client.query({
      query: PURCHASE_ORDER_QUERY,
      variables: {vendorSlug: vendor_id, slug: purchase_order_id},
    });
    return {...data};
  },
};
