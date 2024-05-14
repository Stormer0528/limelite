// Graphql
import {authenticityToken, logError} from "../../../../../utils";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

import * as yup from "yup";

import introspectionQueryResultData from "../../../../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import gql from "graphql-tag";
import capitalize from "lodash/capitalize";
import {
  entrySchema,
  entryItemSchema,
  entryItemSubmissionSchema,
} from "./entry.schema";
import VALIDATE_ENTRY_ITEM_ACCOUNT from "@graphql/queries/validate_entry_item_account.gql";
import CREATE_ENTRY_MUTATION from "@graphql/mutations/create_entry.gql";

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
  createEntry: async (entry) => {
    const submissionSchema = yup.object({
      entryItems: yup.array(
        entryItemSchema.concat(entryItemSubmissionSchema).noUnknown()
      ),
    });

    const variables = entrySchema
      .concat(submissionSchema)
      .noUnknown()
      .cast(entry);

    try {
      const {
        data: {entry},
      } = await client.mutate({
        mutation: CREATE_ENTRY_MUTATION,
        variables,
      });
      return entry;
    } catch (err) {
      logError(err);
      return false;
    }
  },
  /* Validations */
  validateAccount: async (accountInfo) => {
    try {
      const {
        data: {account = {}},
      } = await client.query({
        variables: {
          ...accountInfo,
        },
        fetchPolicy: "network-only",
        query: VALIDATE_ENTRY_ITEM_ACCOUNT,
      });

      return account;
    } catch (err) {
      logError(err);
      return false;
    }
  },
  validateElementcode: async ({elemName, code}) => {
    try {
      const {
        data: {element},
      } = await client.query({
        variables: {
          code,
        },
        fetchPolicy: "network-only",
        query: gql`
        query($code: String) {
          element: account${capitalize(elemName)}ByCode(code: $code) {
            id
          }
        }
        `,
      });

      const {id: isPresent = false} = element || {};

      return Boolean(isPresent);
    } catch (err) {
      logError(err);
      return false;
    }
  },
};

export default API;
