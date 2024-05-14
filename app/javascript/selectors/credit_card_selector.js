import find from "lodash/find";

export const getSelectedAccount = ({accounts, account_id}) =>
  find(accounts, {slug: account_id}) || {};
