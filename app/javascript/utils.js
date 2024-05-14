import {createStore, compose, applyMiddleware} from "redux";
import createSagaMiddleware from "redux-saga";
import findIndex from "lodash/findIndex";
import camelCase from "lodash/camelCase";
import get from "lodash/get";
import currency from "currency.js";
import {format} from "date-fns/esm";
import {titleCase} from "humanize-plus";

// Graphql
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {IntrospectionFragmentMatcher} from "apollo-cache-inmemory";
import introspectionQueryResultData from "./fragments.json";

import {persistCache} from "apollo-cache-persist";
import LocalForage from "localforage";
import site_theme from "./components/shared/themes/site_theme";

//------------------------------------------------------------------------------
export const siteTheme = site_theme;
/**
 * return state given as state
 * @return Object
 */
export const noop = (state = {}) => state;

/**
 * return state given as state
 * @return Array
 */
export const noop_array = (state = []) => state;

/**
 * Configures a store using common middlewares and initializers
 *
 * Includes:
 * -- redux-saga
 * -- redux-devtools-extension
 */
export function configureStore(
  uninitializedStore,
  initialState,
  {sagas = []} = {}
) {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify here name, actionsBlacklist, actionsCreators and other options
        })
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware)
    // other store enhancers if any
  );

  const store = createStore(uninitializedStore, initialState, enhancer);

  // Startup Sagas
  sagas.forEach((saga) => sagaMiddleware.run(saga));

  return store;
}

// Add csrf-token to fetch for rails
// See https://github.com/shakacode/react_on_rails/issues/16#issuecomment-220750318

/**
 *
 * A regular non-safe get request:
 * fetch('/profiles/foobar.json', jsonHeader());
 *
 * How this would look in a safe fetch request:
 * fetch('/profiles.json', safeCredentials({
 *              method: 'POST',
 *              body: JSON.stringify({
 *                  q: input,
 *                  thing: this.props.thing
 *              })
 *          }));
 *
 */

/**
 * For use with window.fetch
 */
export function jsonHeader(options) {
  options = options || {};
  return Object.assign(options, {
    Accept: "application/json",
    "Content-Type": "application/json",
  });
}

/**
 * Lets fetch include credentials in the request. This includes cookies and other possibly sensitive data.
 * Note: Never use for requests across (untrusted) domains.
 */
export function safeCredentials(options) {
  options = options || {};
  return Object.assign(options, {
    credentials: "include",
    mode: "same-origin",
    headers: Object.assign(
      options["headers"] || {},
      authenticityHeader(),
      jsonHeader()
    ),
  });
}

// Rails Ajax Helpers
//------------------------------------------------------------------------------
export function authenticityHeader(options) {
  options = options || {};
  return Object.assign(options, {
    "X-CSRF-Token": getAuthenticityToken(),
    "X-Requested-With": "XMLHttpRequest",
  });
}

export function parseJSON(response) {
  return response.json();
}

export function getAuthenticityToken() {
  return getMetaContent("csrf-token");
}

export function getMetaContent(name) {
  const header = document.querySelector(`meta[name="${name}"]`);
  return header && header.content;
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }

  return false;
}

export function logError(err) {
  console.error(err);
}

// Array Helpers
//------------------------------------------------------------------------------
export function removeItem(group, id) {
  const index = findIndex(group, {id});
  return index < 0
    ? group
    : group.slice(0, index).concat(group.slice(index + 1));
}

export function removeItemAtIndex(group = [], index) {
  return index < 0
    ? group
    : group.slice(0, index).concat(group.slice(index + 1));
}

export function replaceItem(group, newItem) {
  const {id} = newItem;
  const index = findIndex(group, {id});

  // If the item isn't there for some reason
  if (index < 0) {
    return [newItem, ...group];
  }

  return [...group.slice(0, index), newItem, ...group.slice(index + 1)];
}

export function updateItemAtIndex(group, item, index) {
  const newItem = Object.assign({}, group[index], item);
  // If the item isn't there for some reason
  if (index < 0) {
    return [newItem, ...group];
  }

  return [...group.slice(0, index), newItem, ...group.slice(index + 1)];
}

// Ajax and Apollo Helpers
//------------------------------------------------------------------------------
export function authenticityToken() {
  const {content: token = null} =
    document.querySelector('meta[name="csrf-token"]') || {};

  return token;
}

export function setupApolloClient(uri = "/graphql") {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });

  const cache = new InMemoryCache({fragmentMatcher});
  persistCache({
    cache,
    storage: LocalForage,
    maxSize: false,
  });

  // Set up client for graphql
  return new ApolloClient({
    link: createHttpLink({
      uri,
      headers: {
        "X-CSRF-Token": authenticityToken(),
      },
      credentials: "same-origin",
    }),
    cache,
  });
}

export const dataIdFromObject = ({id, slug, number, __typename}) =>
  `${(id, slug, number)}--${__typename}`;

export const serializeParams = (obj, prefix) => {
  let str = [],
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p) && typeof obj[p] !== "undefined") {
      const k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push(
        v !== null && typeof v === "object"
          ? serializeParams(v, k)
          : encodeURIComponent(k) + "=" + encodeURIComponent(v)
      );
    }
  }
  return str.join("&");
};

// Graphql Helpers
//------------------------------------------------------------------------------
export const createUpdateQuery =
  ({fieldName, objectName = "edges"}) =>
  (prevResult, {fetchMoreResult}) => {
    const newEdges = get(fetchMoreResult, `${fieldName}.${objectName}`);
    const pageInfo = get(fetchMoreResult, `${fieldName}.pageInfo`);

    return newEdges.length
      ? {
          // Put the new comments at the end of the list and update `pageInfo`
          // so we have the new `endCursor` and `hasNextPage` values
          [fieldName]: {
            __typename: prevResult[fieldName].__typename,
            [objectName]: [...prevResult[fieldName][objectName], ...newEdges],
            pageInfo,
          },
        }
      : prevResult;
  };

// CURRENCY FUNCTIONS
//------------------------------------------------------------------------------
export const USD = (value) =>
  currency(value, {symbol: "$", formatWithSymbol: true, precision: 2});

export const greaterThan = (val1, val2) => {
  const value1 = amountToCents(val1);
  const value2 = amountToCents(val2);

  return value1 > value2;
};

export const lessThan = (val1, val2) => {
  const value1 = amountToCents(val1);
  const value2 = amountToCents(val2);

  return value1 < value2;
};

export const greaterThanEqualTo = (val1, val2) => {
  const value1 = amountToCents(val1);
  const value2 = amountToCents(val2);

  return value1 >= value2;
};

export const lessThanEqualTo = (val1, val2) => {
  const value1 = amountToCents(val1);
  const value2 = amountToCents(val2);

  return value1 <= value2;
};

export const amountToCents = (amount) =>
  parseInt(Number(parseFloat(Number(currency(amount)).toFixed(2)) * 100));

export const amountToFloat = (amount) =>
  parseFloat(Number(currency(amount)).toFixed(2));

// OTHER
//------------------------------------------------------------------------------
export const camelCaseKeys = (obj = {}) => {
  return Object.entries(obj).reduce((ret, entry) => {
    ret[camelCase(entry[0])] = entry[1];
    return ret;
  }, {});
};

export function searchToObject(search) {
  return search
    .substring(1)
    .split("&")
    .reduce(function (result, value) {
      const parts = value.split("=");
      if (parts[0]) {
        result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }
      return result;
    }, {});
}

export function getFiscalYear(date = new Date()) {
  const year = parseInt(format(date, "YYYY"));
  const fiscalYearStart = parseInt(format(new Date(`${year}-07-01`), "D"));
  const dayOfYear = parseInt(format(date, "D"));

  return dayOfYear < fiscalYearStart ? year : year - 1;
}

export function titleize(str) {
  return titleCase(str.replace("_", " "));
}

const MONTH_CODES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseAmount(amount) {
  if (!amount) return 0;

  return Number(amount.toString().replace(/[$,]/g, ""));
}

export function parseMonthCode(data) {
  const keys = Object.keys(data)
    .map((key) => {
      const parts = key.split("_");
      return {
        month: MONTH_CODES.indexOf(parts[0]) + 1,
        code: parts[0],
        year: `20${parts[1]}`,
        key,
      };
    })
    .filter(({month}) => month > 0)
    .map((key) => ({
      ...key,
      label: MONTH_LABELS[key.month - 1],
    }))
    .sort((a, b) => {
      if (a.year < b.year || (a.year === b.year && a.month < b.month))
        return -1;
      if (a.year > b.year || (a.year === b.year && a.month > b.month)) return 1;

      return 0;
    });

  return keys;
}
