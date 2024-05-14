// Graphql
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import capitalize from "lodash/capitalize";
import gql from "graphql-tag";

import introspectionQueryResultData from "../../../fragments.json";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";

import VALIDATE_ENTRY_ITEM_ACCOUNT from "../../../graphql/queries/validate_entry_item_account.gql";

addEventListener("message", ({data, data: {validate}}) => {
  if (validate === "account") {
    validateAccount({data});
  } else if (validate === "element") {
    validateElementcode({data});
  }
});

const validateElementcode = async ({
  data,
  data: {code, elemName, authenticityToken},
}) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const client = new ApolloClient({
    link: createHttpLink({
      uri: "/graphql",
      headers: {
        "X-CSRF-Token": authenticityToken,
      },
      credentials: "same-origin",
    }),
    cache: new InMemoryCache({fragmentMatcher}),
  });

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

    const {id: isValid = false} = element || {};

    postMessage({isValid: Boolean(isValid)});
  } catch (error) {
    postMessage({data, error});
  }
};

const validateAccount = async ({
  data,
  data: {accountCode, authenticityToken},
}) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const client = new ApolloClient({
    link: createHttpLink({
      uri: "/graphql",
      headers: {
        "X-CSRF-Token": authenticityToken,
      },
      credentials: "same-origin",
    }),
    cache: new InMemoryCache({fragmentMatcher}),
  });

  try {
    const {
      data: {account = {}},
    } = await client.query({
      variables: {
        ...accountCode,
      },
      fetchPolicy: "network-only",
      query: VALIDATE_ENTRY_ITEM_ACCOUNT,
    });
    postMessage({account});
  } catch (error) {
    postMessage({data, error});
  }
};
