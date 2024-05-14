// Graphql
import {authenticityToken} from "../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {logError} from "../../utils";

import introspectionQueryResultData from "../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import BankAccountQuery from "../../graphql/queries/bank_account.gql";
import BankAccountsQuery from "../../graphql/queries/bank_accounts.gql";
import PrintChecksQuery from "../../graphql/queries/print_checks.gql";

import CheckQuery from "../../graphql/queries/check.gql";
import createCheckMutation from "../../graphql/mutations/create_check.gql";
import updateCheckMutation from "../../graphql/mutations/update_check.gql";
import updateCheckFileMutation from "../../graphql/mutations/update_check_file.gql";
import updateDepositFileMutation from "../../graphql/mutations/update_deposit_file.gql";
import destroyCheckMutation from "../../graphql/mutations/destroy_check.gql";
import destroyDepositMutation from "../../graphql/mutations/destroy_deposit.gql";
import destroyAccountTransferMutation from "../../graphql/mutations/destroy_account_transfer.gql";

import DepositQuery from "../../graphql/queries/deposit.gql";
import createDepositMutation from "../../graphql/mutations/create_deposit.gql";
import updateDepositMutation from "../../graphql/mutations/update_deposit.gql";

import AccountTransferQuery from "../../graphql/queries/account_transfer.gql";
import createAccountTransferMutation from "../../graphql/mutations/create_account_transfer.gql";
import updateAccountTransferMutation from "../../graphql/mutations/update_account_transfer.gql";

import validateAccountQuery from "../../graphql/queries/validate_account.gql";

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
  fetchBankAccountChecks: async (slug) => {
    const {data = {}} = await client.query({
      query: PrintChecksQuery,
      variables: {slug},
    });

    return {...data};
  },
  /* Checks */
  fetchCheck: async (bank_account_slug, check_id) => {
    const {data = {}} = await client.query({
      query: CheckQuery,
      variables: {bank_account_slug, check_id},
    });

    return {...data};
  },
  createCheck: async ({check, stateAction = "save_draft", reason = ""}) => {
    const {data: {createCheck: response} = {}} = await client.mutate({
      mutation: createCheckMutation,
      variables: {check, stateAction, reason},
    });

    return response;
  },
  updateCheck: async ({check, stateAction = "save_draft", reason = ""}) => {
    const {data: {updateCheck: response} = {}} = await client.mutate({
      mutation: updateCheckMutation,
      variables: {check, stateAction, reason},
    });

    return response;
  },

  updateCheckFile: async ({ id, fileUrl }) => {
    await client.mutate({
      mutation: updateCheckFileMutation,
      variables: { id, fileUrl },
    });
  },

  updateDepositFile: async ({ id, fileUrl }) => {
    await client.mutate({
      mutation: updateDepositFileMutation,
      variables: { id, fileUrl },
    });
  },

  destroyCheck: async (id) => {
    const {data: {destroyCheck: response} = {}} = await client.mutate({
      mutation: destroyCheckMutation,
      variables: {id},
    });

    return response;
  },

  /* Deposits */
  fetchDeposit: async (bank_account_slug, deposit_id) => {
    const {data = {}} = await client.query({
      query: DepositQuery,
      variables: {bank_account_slug, deposit_id},
    });

    return {...data};
  },
  createDeposit: async ({deposit, stateAction = "save_draft", reason = ""}) => {
    const {data: {createDeposit: response} = {}} = await client.mutate({
      mutation: createDepositMutation,
      variables: {deposit, stateAction, reason},
    });

    return response;
  },
  updateDeposit: async ({deposit, stateAction = "save_draft", reason = ""}) => {
    const {data: {updateDeposit: response} = {}} = await client.mutate({
      mutation: updateDepositMutation,
      variables: {deposit, stateAction, reason},
    });

    return response;
  },
  destroyDeposit: async (id) => {
    const {data: {destroyDeposit: response} = {}} = await client.mutate({
      mutation: destroyDepositMutation,
      variables: {id},
    });

    return response;
  },
  fetchAccountTransfer: async (bank_account_slug, account_transfer_id) => {
    const {data = {}} = await client.query({
      query: AccountTransferQuery,
      variables: {bank_account_slug, account_transfer_id},
    });

    return {...data};
  },
  createAccountTransfer: async ({
    accountTransfer,
    stateAction = "save_draft",
    reason = "",
  }) => {
    const {data: {createAccountTransfer: response} = {}} = await client.mutate({
      mutation: createAccountTransferMutation,
      variables: {accountTransfer, stateAction, reason},
    });

    return response;
  },
  updateAccountTransfer: async ({
    accountTransfer,
    stateAction = "save_draft",
    reason = "",
  }) => {
    const {data: {updateAccountTransfer: response} = {}} = await client.mutate({
      mutation: updateAccountTransferMutation,
      variables: {accountTransfer, stateAction, reason},
    });

    return response;
  },

  destroyAccountTransfer: async (id) => {
    const {data: {destroyAccountTransfer: response} = {}} = await client.mutate(
      {
        mutation: destroyAccountTransferMutation,
        variables: {id},
      }
    );

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
