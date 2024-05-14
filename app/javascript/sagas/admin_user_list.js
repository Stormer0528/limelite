import {put, call, takeEvery} from "redux-saga/effects";
import {authenticityToken} from "../utils";

import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

// GQL Queries
import updateUserTypeMutation from "../graphql/mutations/update_user_type.gql";
import updateUserRoleMutation from "../graphql/mutations/update_user_role.gql";

import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import introspectionQueryResultData from "../fragments.json";

export default function* watchMassSubmit() {
  yield takeEvery("SET_USER_ROLE", setUserRole);
  yield takeEvery("SET_USER_TYPE", setUserType);
}

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

function* setUserRole({
  role,
  id: userId,
  orgId: organizationId,
  refetch,
  variables,
}) {
  yield client.mutate({
    mutation: updateUserRoleMutation,
    variables: {
      role,
      userId,
      organizationId,
    },
  });

  yield call(refetch, variables);

  yield put({type: "users/setUserMessageType", payload: "success"});
  yield put({
    type: "users/setUserMessage",
    payload: "User successfully updated",
  });
  yield put({type: "users/showUserMessage"});
}

function* setUserType({
  userType,
  id: userId,
  orgId: organizationId,
  refetch,
  variables,
}) {
  yield client.mutate({
    mutation: updateUserTypeMutation,
    variables: {
      type: userType,
      userId,
      organizationId,
    },
  });

  yield call(refetch, variables);

  yield put({type: "users/setUserMessageType", payload: "success"});
  yield put({
    type: "users/setUserMessage",
    payload: "User successfully updated",
  });
  yield put({type: "users/showUserMessage"});
}
