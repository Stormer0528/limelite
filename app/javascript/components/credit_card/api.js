// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {logError} from "../../utils";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import BankAccountQuery from "@graphql/queries/bank_account.gql";
import BankAccountsQuery from "@graphql/queries/bank_accounts.gql";

import PaymentQuery from "@graphql/queries/credit_card_payment.gql";
import createPaymentMutation from "@graphql/mutations/create_payment.gql";
import updatePaymentMutation from "@graphql/mutations/update_payment.gql";
import destroyPaymentMutation from "@graphql/mutations/destroy_payment.gql";

import validateAccountQuery from "@graphql/queries/validate_account.gql";

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
  fetchBankAccounts: async () => {
    const {data = {}} = await client.query({
      query: BankAccountsQuery,
    });
    return {...data};
  },
  fetchBankAccount: async (slug) => {
    const {data = {}} = await client.query({
      query: BankAccountQuery,
      variables: {slug},
    });

    return {...data};
  },

  /* Payments */
  fetchPayment: async (bank_account_slug, payment_id) => {
    const {data = {}} = await client.query({
      query: PaymentQuery,
      variables: {bank_account_slug, payment_id},
    });

    return {...data};
  },
  createPayment: async ({payment, stateAction = "save_draft", reason = ""}) => {
    const {data: {createPayment: response} = {}} = await client.mutate({
      mutation: createPaymentMutation,
      variables: {payment, stateAction, reason},
    });

    return response;
  },
  updatePayment: async ({payment, stateAction = "save_draft", reason = ""}) => {
    const {data: {updatePayment: response} = {}} = await client.mutate({
      mutation: updatePaymentMutation,
      variables: {payment, stateAction, reason},
    });

    return response;
  },
  destroyPayment: async (id) => {
    const {data: {destroyPayment: response} = {}} = await client.mutate({
      mutation: destroyPaymentMutation,
      variables: {id},
    });

    return response;
  },

  /* Validations */
  validateAccount: async (accountInfo) => {
    try {
      const {
        data: {accountByNumber: account = {}},
      } = await client.query({
        variables: {
          ...accountInfo,
        },
        query: validateAccountQuery,
      });

      return account;
    } catch (err) {
      logError(err);
      return false;
    }
  },
};

export default API;
